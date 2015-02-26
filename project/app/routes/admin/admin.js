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
router.get('/partners', require('./partners/list'));
router.get("/partners/:id", require('./partners/single'));
router.post('/partners', require('./partners/create'));

router.post('/cards-bundle', require('./cardsbundle/create'));
router.get('/cards-bundle', require('./cardsbundle/list'));

router.get('/cards/:bundleId', require('./cards/list'));

// router.post('/customers', require('./customers/create'));
router.post("/customers/", function(req, res, next){
	req.actions.customers.createCustomer({
		data : req.body
	}, function(responseData){
		res.sendData(responseData);
	});
});

router.get('/customers', require('./customers/list'));
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
router.get('/payments', require('./payments/list'));

router.get('/orders', require('./orders/list'));

router.get('/locations', require('./locations/list'));


module.exports = router;
