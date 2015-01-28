module.exports = function(req, res, next){
	req.models.Partner.findAll({
		include: [ req.models.PartnerAccount ]
	})
	.then(function(partners) {
		res.json(partners);
	});
};