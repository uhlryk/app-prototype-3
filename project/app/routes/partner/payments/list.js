module.exports = function(req, res, next){
	req.models.Payment.findAll({
		include: [req.models.Place, req.models.PartnerAccount, req.models.Order],
		where : {
			PartnerId : req.user.data.partnerId
		}
	})
	.then(function(orders) {
		res.json(orders);
	});
};