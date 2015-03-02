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
router.get("/cards/", function(req, res, next){
	var query = req.query;
	req.actions.cards.list({
		query : {
			customerId : req.user.data.customerId,
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.post("/cards/add/", function(req, res, next){
	req.actions.cards.add({
		data : req.body,
		query : {
			customerId : req.user.data.customerId,
			customerAccountId : req.user.id
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.post("/cards/create/", function(req, res, next){
	req.actions.cards.create({
		data : req.body,
		query : {
			customerId : req.user.data.customerId,
			customerAccountId : req.user.id
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});

//router.post('/cards/create', require('./cards/create'));



router.get("/accounts/", function(req, res, next){
	var query = req.query;
	req.actions.customers.listAccount({
		query : {
			customerId : req.user.data.customerId,
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.post("/accounts/", function(req, res, next){
	req.actions.customers.createAccount({
		data : req.body,
		query : {
			customerId : req.user.data.customerId
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});

router.get("/orders/", function(req, res, next){
	var query = req.query;
	console.log("a1");
	req.actions.orders.list({
		query : {
			customerId : req.user.data.customerId,
			page : query.page
		}
	}, function(responseData){
		console.log("a2");
		res.sendData(responseData);
	});
});
module.exports = router;
