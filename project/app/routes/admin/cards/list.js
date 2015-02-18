module.exports = function(req, res, next){
	var bundleId = Number(req.params.bundleId);
	req.models.Card.findAll({
		where : {
			'CardBundleId' : bundleId
		},
		include : [req.models.Customer, req.models.CardBundle]
	})
	.then(function(cards) {
		res.json(cards);
	});
};