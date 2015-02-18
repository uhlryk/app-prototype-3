module.exports = function(req, res, next){
	req.models.Order.findAll({
		include: [
			{
				model : req.models.Card,
				include : [req.models.Customer]
			},
			req.models.Score, req.models.Payment,
			{
				model : req.models.PartnerAccount,
				include : [req.models.Partner]
			},
			req.models.Place
		],
	})
	.then(function(orders) {
		res.json(orders);
	});
};