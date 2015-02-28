/**
 * Sekcja api dostępna dla administracji tylko
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
					if(user.role === "admin"){
						return next();
					} else {
						res.sendStatus(401);
					}
				}
			}
		});
	}
});

router.get("/partners/", function(req, res, next){
	var query = req.query;
	req.actions.partners.list({
		query : {
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});

router.get("/partners/:id", require('./partners/single'));
router.post("/partners/", function(req, res, next){
	req.actions.partners.createMain({
		data : req.body
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.post("/cards-bundle", function(req, res, next){
	req.actions.cardsbundles.create({
		data : req.body
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.get("/cards-bundle/", function(req, res, next){
	var query = req.query;
	req.actions.cardsbundles.list({
		query : {
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});

router.get("/cards/", function(req, res, next){
	var query = req.query;
	req.actions.cards.list({
		query : {
			bundleId : query.bundleId,
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});

router.post("/customers/", function(req, res, next){
	req.actions.customers.createMain({
		data : req.body
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.get("/customers/", function(req, res, next){
	var query = req.query;
	req.actions.customers.list({
		query : {
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.get('/customers/:id', require('./customers/single'));

router.post("/payments", function(req, res, next){
	var data = req.body;
	if(data.type !== "package" && data.type !== "fee"){
		return res.sendData({status :422, code : "WRONG_PAYMENT_TYPE"});
	}
	req.actions.payments.create({
		data : data
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.get("/payments/", function(req, res, next){
	var query = req.query;
	req.actions.payments.list({
		query : {
			partnerId : query.partnerId,
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});

router.get('/orders', require('./orders/list'));

router.get('/locations', require('./locations/list'));


module.exports = router;
