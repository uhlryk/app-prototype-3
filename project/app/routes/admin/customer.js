/**
 * Motody związane bezpośrednio z kontami customerów
 */
var express = require('express');
var router = new express.Router();
router.post('/create', function(req, res, next) {
	res.send('utworzenie konta customer');
});
router.get('/list', function(req, res, next){
	res.send('lista customerów');
});
module.exports = router;
