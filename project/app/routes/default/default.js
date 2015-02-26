/**
 * Sekcja api dostępna dla wszystkich użytkowników aplikacji, nie wymaga autoryzacji
 */
var express = require('express');
var router = new express.Router();

router.use(function(req, res, next){
	console.log("sprawdzamy uprawnienia default");
	next();
}, function(req, res, next){
	console.log("kolejny test default");
	next();
});

router.post("/authenticate/customer", require('./authenticate/customer'));
router.post("/authenticate/partner", require('./authenticate/partner'));
router.post("/authenticate/admin", require('./authenticate/admin'));

router.post("/customer/account/", function(req, res, next){
	req.actions.customers.createMain({
		data : req.body
	}, function(responseData){
		res.sendData(responseData);
	});
});
module.exports = router;
