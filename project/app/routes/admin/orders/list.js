module.exports = function(req, res, next){
	req.models.Order.findAll({
		include: [
			req.models.PartnerAccount,
			{
				model: req.models.Payment,
				include: [
					req.models.Place
				]
			}
		]
	})
	.then(function(orders) {
		res.json(orders);
	});
};