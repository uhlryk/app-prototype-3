/**
 * Motody tworzenia konta (account zawiera normalnie tworzenie kont partnera i customera, ale dla partnera uprawnienie to admin)
 */
var express = require('express');
var router = new express.Router();
router.post('/create-customer', function(req, res, next) {
	res.send('utworzenie konta customera');
});
module.exports = router;
