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

router.post("/authenticate/customer", require('./authenticate/customer'));
router.post("/authenticate/partner", require('./authenticate/partner'));
router.post("/authenticate/admin", require('./authenticate/admin'));

router.post("/customer/account/", require('./customer/account'));



/** ------------------- Przykład poprawnego obsłużenia api, do usunięcia jak pokryjemy ---------------------------- */
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
router.get("/test/posts/", require('./test/list'));
router.get("/test/posts/:id", require('./test/single'));
router.post("/test/posts/", require('./test/add'));
router.put("/test/posts/:id", require('./test/update'));
router.delete("/test/posts/:id", require('./test/delete'));

/** ----------------------------------------------------------------------------------------------------------------- */
module.exports = router;
