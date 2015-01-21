/**
 * Motody związane z kartami
 */
var express = require('express');
var router = new express.Router();
router.post('/create', function(req, res, next) {
	res.send('utworzenie pakietu');
});
router.get('/list', function(req, res, next){
	res.send('lista kart');
});
module.exports = router;
