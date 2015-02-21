/**
 * Sekcja api dostępna dla klientów tylko
 */

/**
 *  Kody błędów
 *  http://pl.wikipedia.org/wiki/Kod_odpowiedzi_HTTP
 * używamy 400 nieprawidłowe zapytanie
 * 401 nieautoryzowany dostęp
 * 404 brak zasoby
 *	res.end();
 */
var express = require('express');
var router = new express.Router();
router.use(function(req, res, next){
	var token = req.headers['access-token'];
	if(token){
		req.redis.get('t_' + token, function(error, result) {
			var user = JSON.parse(result);
			if (error) {
				return res.sendStatus(403, error);
			} else {
				if(user === null){
					res.sendStatus(401);
				} else {
					req.user = user;
					if(user.role === "customer"){
						return next();
					} else {
						res.sendStatus(401);
					}
				}
			}
		});
	}
});
router.get('/cards/', require('./cards/list'));
router.post('/cards/add', require('./cards/add'));
router.post('/cards/create', require('./cards/create'));

router.get('/accounts/', require('./accounts/list'));
router.get('/orders/', require('./orders/list'));

module.exports = router;
