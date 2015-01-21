/**
 * Sekcja api dostępna dla administracji tylko
 */

/**
 *  Kody błędów
 *  http://pl.wikipedia.org/wiki/Kod_odpowiedzi_HTTP
 * używamy 400 nieprawidłowe zapytanie
 * 401 nieautoryzowany dostęp
 * 404 brak zasoby
 *	res.end();
 */
var express = require('express');
var router = new express.Router();
router.use('/auth', require('./default/auth'));
router.use('/partner', require('./admin/partner'));
router.use('/customer', require('./admin/customer'));
router.use('/card', require('./admin/card'));
router.all("/*", function(req ,res, next){
		res.writeHead(404);
		res.end();
});
module.exports = router;
