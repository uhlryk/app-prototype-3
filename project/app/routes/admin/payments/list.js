module.exports = function(req, res, next){
	req.models.Payment.findAll({
		include: [ req.models.PartnerAccount, req.models.Place, req.models.Partner ]
	})
	.then(function(payments) {
		res.json(payments);
	});
};