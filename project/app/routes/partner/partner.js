/**
 * Sekcja api dostępna dla partnerów tylko
*/
var express = require('express');
var router = new express.Router();

router.use(function(req, res, next){
	var token = req.headers['access-token'];
	if(token){
		console.log(token);
		req.redis.get('t_' + token, function(error, result) {
			var user = JSON.parse(result);
			if (error) {
				return res.sendStatus(403, error);
			} else {
				if(user === null){
					return res.sendStatus(401);
				} else {
					req.user = user;
					if(user.role === "partner"){
						return next();
					} else {
						return res.sendStatus(401);
					}
				}
			}
		});
	}
});

router.post('/orders', require('./orders/create'));
router.get('/orders', require('./orders/list'));

router.get('/payments', require('./payments/list'));

module.exports = router;
