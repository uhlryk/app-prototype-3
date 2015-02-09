module.exports = function(req, res, next){
	req.models.Payment.findAll({
		include: [ ],
		where : {
			PartnerAccountId : req.partner.id
		}
	})
	.then(function(orders) {
		res.json(orders);
	});
};