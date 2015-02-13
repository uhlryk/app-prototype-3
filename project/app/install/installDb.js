module.exports = function(models) {
	var fs = require("fs");
	fs.readFile("./project/app/install/location.json", function (err, data) {
	if (err) throw err;
		var locationData = JSON.parse(data);
		// console.log(locationData);
		return models.Location.findAll()
		.then(function(locations) {
			if(locations.length === 0){
				models.Location.create({
					name : locationData.name,
					level : 0
				})
				.then(function(countryModel){
					var provinceList = locationData.province;
					return models.sequelize.Promise.map(provinceList, function(province) {
						return models.Location.create({
							name : province.name,
							level : 1,
							LocationId : countryModel.id
						})
						.then(function(provinceModel){
							var districtList = province.district;
							return models.sequelize.Promise.map(districtList, function(district) {
								return models.Location.create({
									name : district.name,
									level : 2,
									LocationId : provinceModel.id
								})
								.then(function(districtModel){
									var communityList = district.community;
									return models.sequelize.Promise.map(communityList, function(community) {
										return models.Location.create({
											name : community,
											level : 3,
											LocationId : districtModel.id
										});
									});
								});
							});
						});
					});
				});
			}
		});
	});
};