/**
 * Sekcja api dostępna dla partnerów tylko
 */
var express = require('express');
var router = new express.Router();

router.use(function(req, res, next){
//TYMCZASOWE DO SZYBKIEGO LOGOWANIA
	req.partner ={ token: '0da26870-b0a4-11e4-9582-dfe96949e4ae',
  role: 'partner',
  id: 3,
  data: { firmname: 'test', places: [ [Object] ] } };
next();
	// var token = req.headers['access-token'];
	// if(token){
	// 	var isPartner = false;
	// 	req.auth.forEach(function(v){
	// 		if(v.token === token){
	// 			req.partner = v;
	// 			console.log(v);
	// 			next();
	// 			isPartner = true;
	// 		}
	// 	});
	// 	if(isPartner === false){
	// 		res.sendStatus(401);
	// 	}
	// } else {
	// 	res.sendStatus(401);
	// }
});

router.post('/orders', require('./orders/create'));
router.get('/orders', require('./orders/list'));

router.get('/payments', require('./payments/list'));

module.exports = router;
