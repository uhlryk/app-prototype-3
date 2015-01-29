/**
 * Sekcja api dostępna dla administracji tylko
 */
var express = require('express');
var router = new express.Router();

router.use(function(req, res, next){
	var token = req.headers['access-token'];
	if(token){
		next();
	}else{
		res.sendStatus(401);
	}
});
router.get('/partners', require('./partners/list'));
router.post('/partners', require('./partners/create'));

router.post('/cards', require('./cards/create'));
router.get('/cards', require('./cards/list'));

router.post('/customers', require('./customers/create'));
router.get('/customers', require('./customers/list'));

module.exports = router;
