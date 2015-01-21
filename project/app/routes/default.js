/**
 * Sekcja api dostępna dla wszystkich użytkowników aplikacji, nie wymaga autoryzacji
 */
var express = require('express');
var router = new express.Router();
router.use('/auth', require('./default/auth'));
router.use('/customer', require('./default/customer'));
router.all("/*", function(req ,res, next){
		res.writeHead(404);
		res.end();
});
module.exports = router;
