module.exports = function(req, res, next){
	req.models.Order.findAll({
		include: [ {
			model : req.models.Card,
			include : [req.models.Customer]
		}, req.models.Score, req.models.Payment,  req.models.PartnerAccount, req.models.Place],
		where : {
			PartnerAccountId : req.user.id
		}
	})
	.then(function(orders) {
		res.json(orders);
	});
};