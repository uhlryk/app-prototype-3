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

router.post("/customer/account/", require('./customer/account'));


module.exports = router;
