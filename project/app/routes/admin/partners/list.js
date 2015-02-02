module.exports = function(req, res, next){
	req.models.Partner.findAll({
		include: [ req.models.PartnerAccount, req.models.Place ]
	})
	.then(function(partners) {
		res.json(partners);
	});
};