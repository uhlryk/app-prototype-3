var express = require('express');

var router = new express.Router();
router.get('/foo', function(req, res, next) {
	res.send("test");
});


module.exports = router;
