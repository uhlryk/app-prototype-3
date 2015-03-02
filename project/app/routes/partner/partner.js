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
router.post("/orders/", function(req, res, next){
	req.actions.orders.create({
		percentageApp : 2,
		convCashScore : 12.5,
		partnerAccountId : req.user.id,
		data : req.body
	}, function(responseData){
		res.sendData(responseData);
	});
});

router.get("/orders/", function(req, res, next){
	var query = req.query;
	req.actions.orders.list({
		query : {
			partnerAccountId : req.user.id,
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});
router.get("/payments/", function(req, res, next){
	var query = req.query;
	req.actions.payments.list({
		query : {
			partnerId : req.user.data.partnerId,
			page : query.page
		}
	}, function(responseData){
		res.sendData(responseData);
	});
});
module.exports = router;
