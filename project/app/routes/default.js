var express = require('express');

var router = new express.Router();
router.use('/test', require('./default/test'));

router.all("/*", function(req ,res, next){
		res.send("brak");
});


module.exports = router;
