module.exports = function(req, res, next){
	req.models.CardBundle.findAll()
	.then(function(cardBundle) {
		res.json(cardBundle);
	});
};