module.exports = function(req, res, next){
	req.models.Order.findAll({
		include: [
			{
				model : req.models.Card,
				include : [req.models.Customer]
			},
			req.models.Score,
			{
				model : req.models.PartnerAccount,
				include : [req.models.Partner]
			},
			req.models.Place
		],
		where : {
			'Card.CustomerId' : req.user.data.customerId
		}
	})
	.then(function(orders) {
		res.json(orders);
	});
};