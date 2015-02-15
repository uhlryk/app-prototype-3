module.exports = function(req, res, next){
	var id = Number(req.params.id);
	req.models.Partner.find({
		include : [
			req.models.PartnerAccount,
			{
				model : req.models.Place,
				include : [{
					model : req.models.PlaceLocation,
					include : [{
						model : req.models.Location,
						attributes : [
							"level",
							"LocationId",
							"name",
						]
					}],
					attributes : [
						"LocationId",
						"isAll"
					]
				}]
			}
		],
		where : {
			id : id
		}
	})
	.then(function(partner) {
		res.json(partner);
	});
};