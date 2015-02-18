module.exports = function(req, res, next){
	req.models.Payment.findAll({
		include: [req.models.Place, req.models.PartnerAccount, req.models.Order, req.models.Partner]
	})
	.then(function(payments) {
		res.json(payments);
	});
};