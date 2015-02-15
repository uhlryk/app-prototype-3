var bcrypt = require('bcrypt');
module.exports = function(req, res, next){
	var data = req.body;
	console.log(JSON.stringify(data.location.province));
	var partnerAccountModel, partnerModel, placeModel;
	req.models.sequelize.transaction().then(function (t) {
		return req.models.PartnerAccount.create({
			type : "parent",
			status : "active",
			email : data.account.login,
			password : bcrypt.hashSync(data.account.password, 8)
		}, {transaction : t})
		.then(function(partnerAccount){
			partnerAccountModel = partnerAccount;
		})
		.then(function(){
			return req.models.Partner.create({
				status : "active",
				firmname : data.firm.firmname,
				nip : data.firm.nip,
				street_address : data.firm.street_address,
				house_address : data.firm.house_address,
				flat_address : data.firm.flat_address,
				zipcode_address : data.firm.zipcode_address,
				city_address : data.firm.city_address,
				is_mail_address : data.firm.is_mail_address,
				name_mail : data.mail.name_mail,
				street_mail : data.mail.street_mail,
				house_mail : data.mail.house_mail,
				flat_mail : data.mail.flat_mail,
				zipcode_mail : data.mail.zipcode_mail,
				city_mail : data.mail.city_mail,
				firstname : data.contact.firstname,
				lastname : data.contact.lastname,
				phone : data.contact.phone,
			}, {transaction : t});
		})
		.then(function(partner){
			partnerModel = partner;
		})
		.then(function(){
			return partnerModel.setPartnerAccounts([partnerAccountModel], {transaction : t});
		})
		.then(function(){
			return req.models.Place.create({
				name : data.location.name
			}, {transaction : t});
		})
		.then(function(place){
			placeModel = place;
		})
		.then(function(){
			return placeModel.setPartnerAccounts([partnerAccountModel], {transaction : t});
		})
		.then(function(){
			return partnerModel.setPlaces([placeModel], {transaction : t});
		}, {transaction : t})
		.then(function(){
			return req.models.sequelize.Promise.map(data.location.province, function(provinceData) {
				var provinceModel;
				return req.models.Location.find({
					where : {
						id : provinceData.id,
						level : 1
					}
				}, {transaction : t})
				.then(function(province){
					provinceModel = province;
					if(province === null){
						throw new Error("brak województwa " + provinceData.id);
					}
				})
				.then(function(){
					var isAll = provinceData.district.length > 0 ? false : true;
					return req.models.PlaceLocation.create({
						PlaceId : placeModel.id,
						LocationId : provinceModel.id,
						isAll : isAll
					}, {transaction : t});
				})
				.then(function(){
					return req.models.sequelize.Promise.map(provinceData.district, function(districtData) {
						var districtModel;
						return req.models.Location.find({
							where : {
								id : districtData.id,
								LocationId : provinceModel.id, //czy lokacja ma poprawną lokację nadrzędną
								level : 2
							}
						}, {transaction : t})
						.then(function(district){
							districtModel = district;
							if(district === null){
								throw new Error("brak powiatu " + districtData.id);
							}
						})
						.then(function(){
							var isAll = districtData.community.length > 0 ? false : true;
							return req.models.PlaceLocation.create({
								PlaceId : placeModel.id,
								LocationId : districtModel.id,
								isAll : isAll
							}, {transaction : t});
						})
						.then(function(){
							return req.models.sequelize.Promise.map(districtData.community, function(communityData) {
								var communityModel;
								return req.models.Location.find({
									where : {
										id : communityData.id,
										LocationId : districtModel.id, //czy lokacja ma poprawną lokację nadrzędną
										level : 3
									},
								}, {transaction : t})
								.then(function(community){
									communityModel = community;
									if(community === null){
										throw new Error("brak gminy " + communityData.id);
									}
								})
								.then(function(){
									return req.models.PlaceLocation.create({
										PlaceId : placeModel.id,
										LocationId : communityModel.id,
										isAll : false
									}, {transaction : t});
								})
								;
							})
							;
						})
						;
					})
					;
				});
			});
		})
		.then(function(){
			t.commit();
			res.sendStatus(200);
		})
		.catch(function(err){
			t.rollback();
			console.log("BŁĄD");
			console.log(err);
			console.log("BŁĄD");
			res.sendStatus(406);
		})
		;
	});
};