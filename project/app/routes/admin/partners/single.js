module.exports = function(req, res, next){
	var id = Number(req.params.id);
	req.models.Partner.find({
		include : [
			req.models.PartnerAccount,
			req.models.Place
		],
		where : {
			id : id
		}
	})
	.then(function(partner) {
		res.json(partner);
	});
};