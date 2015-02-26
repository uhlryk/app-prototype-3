var bcrypt = require('bcrypt');
module.exports = function(config, cb, models){
	var data = config.data;
	var partnerAccountModel, partnerModel, placeModel;
	models.sequelize.transaction().then(function (t) {
		return models.PartnerAccount.create({
			type : "parent",
			status : "active",
			email : data.account.login,
			password : bcrypt.hashSync(data.account.password, 8)
		}, {transaction : t})
		.then(function(partnerAccount){
			partnerAccountModel = partnerAccount;
		})
		.then(function(){
			if(data.firm.is_mail_address){
				data.mail.name_mail = data.firm.firmname;
				data.mail.street_mail = data.firm.street_address;
				data.mail.house_mail = data.firm.house_address;
				data.mail.flat_mail = data.firm.flat_address;
				data.mail.zipcode_mail = data.firm.zipcode_address;
				data.mail.city_mail = data.firm.city_address;
			}
			return models.Partner.create({
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
			return models.Place.create({
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
			return models.sequelize.Promise.map(data.location.province, function(provinceData) {
				var provinceModel;
				return models.Location.find({
					where : {
						id : provinceData.id,
						level : 1
					}
				}, {transaction : t})
				.then(function(province){
					provinceModel = province;
					if(province === null){
						throw new Error("WRONG_PROVINCE");
					}
				})
				.then(function(){
					var isAll = provinceData.district.length > 0 ? false : true;
					return models.PlaceLocation.create({
						PlaceId : placeModel.id,
						LocationId : provinceModel.id,
						isAll : isAll
					}, {transaction : t});
				})
				.then(function(){
					return models.sequelize.Promise.map(provinceData.district, function(districtData) {
						var districtModel;
						return models.Location.find({
							where : {
								id : districtData.id,
								LocationId : provinceModel.id, //czy lokacja ma poprawną lokację nadrzędną
								level : 2
							}
						}, {transaction : t})
						.then(function(district){
							districtModel = district;
							if(district === null){
								throw new Error("WRONG_DISTRICT");
							}
						})
						.then(function(){
							var isAll = districtData.community.length > 0 ? false : true;
							return models.PlaceLocation.create({
								PlaceId : placeModel.id,
								LocationId : districtModel.id,
								isAll : isAll
							}, {transaction : t});
						})
						.then(function(){
							return models.sequelize.Promise.map(districtData.community, function(communityData) {
								var communityModel;
								return models.Location.find({
									where : {
										id : communityData.id,
										LocationId : districtModel.id, //czy lokacja ma poprawną lokację nadrzędną
										level : 3
									},
								}, {transaction : t})
								.then(function(community){
									communityModel = community;
									if(community === null){
										throw new Error("WRONG_COMMUNITY");
									}
								})
								.then(function(){
									return models.PlaceLocation.create({
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
			cb({status :200 });
		})
		.catch(models.Sequelize.ValidationError, function (err) {
			t.rollback();
			if(err.name === 'SequelizeUniqueConstraintError'){
				cb({status :422, code : "DUPLICATE_USER"});
			} else {
				cb({status :500});
			}
			console.log(err);
		})
		.catch(function(err){
			t.rollback();
			console.log(err);
			if (err.code){
				cb({status :422, code : err.code});
			} else{
				cb({status :500});
			}
		});
	});
};