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
	var token = req.query.token;
	if(token){
		next();
	}else{
			res.sendStatus(401);
	}
});
// router.use('/partner', require('./admin/partner'));

module.exports = router;
