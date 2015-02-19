module.exports = function(req, res, next){
	var bundleId = Number(req.params.bundleId);
	req.models.Card.findAll({
		where : {
			'CustomerId' : req.user.data.customerId
		},
		include : [req.models.Customer, req.models.CardBundle]
	})
	.then(function(cards) {
		res.json(cards);
	});
};