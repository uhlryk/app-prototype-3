/**
 * Motody związane bezpośrednio z kontami partnerów
 */
var express = require('express');
var router = new express.Router();
router.post('/create', function(req, res, next) {
	res.send('utworzenie konta partnera');
});
router.get('/list', function(req, res, next){
	res.send('lista partnerów');
});
module.exports = router;
