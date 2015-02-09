module.exports = function(req, res, next){
	req.models.Order.findAll({
		include: [ req.models.Card, req.models.Score, req.models.Payment,  req.models.PartnerAccount],
		where : {
			PartnerAccountId : req.partner.id
		}
	})
	.then(function(orders) {
		res.json(orders);
	});
};