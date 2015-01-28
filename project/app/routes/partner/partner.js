/**
 * Sekcja api dostępna dla partnerów tylko
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
// router.use('/partner', require('./admin/partner'));

module.exports = router;
