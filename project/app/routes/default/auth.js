/**
 * Moetody logowania admina, partnera, customera, zarówno przez login i hasło jak i apitoken
 * Metody akceptują zarówno login i hasło jak i apitoken, na podstawie otrzymanych parametrów robią autoryzację
 */
var express = require('express');
var router = new express.Router();
router.get('/admin', function(req, res, next) {
	res.send('admin login');
});
router.get('/partner', function(req, res, next) {
	res.send('partner login');
});
router.get('/customer', function(req, res, next) {
	res.send('customer login');
});
module.exports = router;
