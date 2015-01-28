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
module.exports = router;
