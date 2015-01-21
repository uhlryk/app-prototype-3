/**
 * Sekcja api dostępna dla wszystkich użytkowników aplikacji, nie wymaga autoryzacji
 */
var express = require('express');
var router = new express.Router();

router.use(function(req, res, next){
	console.log("sprawdzamy uprawnienia default");
	next();
}, function(req, res, next){
	console.log("kolejny test default");
	next();
});

router.post("/auth/", require('./default/auth'));
router.post("/customer/account/", require('./default/customer/account'));


var data = [
	{
		id : 1353,
		title : "pierwszy tytuł",
		description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit ad repellat enim eos excepturi, atque qui quam possimus labore tempore."
	},
	{
		id : 1373,
		title : "drugi tytuł",
		description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos nemo asperiores blanditiis illo quisquam ea nisi aperiam, perferendis beatae dolorum."
	},
	{
		id : 1393,
		title : "trzeci tytuł",
		description : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, temporibus facere error vitae maiores excepturi recusandae sit eaque beatae odit."
	},
];
router.all("/test/*", function(req, res, next){
	req.data = data;
	next();
}, function(req, res, next){
	console.log("jakieś specjalne sprawdzenie dla test tylko");
	next();
});
router.get("/test/posts/", require('./default/test/list'));
router.get("/test/posts/:id", require('./default/test/single'));
router.post("/test/posts/", require('./default/test/add'));
router.put("/test/posts/:id", require('./default/test/update'));
router.delete("/test/posts/:id", require('./default/test/delete'));


router.all("/*", function(req ,res, next){
		res.sendStatus(404);
});
module.exports = router;
