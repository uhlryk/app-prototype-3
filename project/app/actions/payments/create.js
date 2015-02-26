var bcrypt = require('bcrypt');
module.exports = function(config, cb, models){
	var data = config.data;
	models.sequelize.transaction().then(function (t) {
		return 	models.Partner.find({
			include : [
				models.Place
			],
			where : {
				id : data.partnerId,
				'Places.id' : data.placeId
			}
		}, {transaction : t})
		.then(function(partner){
			if(partner === null)
			{
				throw {code : "INCORECT_PARTNER_PLACE"};
			}else{
				return models.Payment.create({
					money : data.money,
					PartnerId : data.partnerId,
					PlaceId : data.placeId,
					type : data.type,
					title : data.title
				}, {transaction : t});
			}
		})
		.then(function(){
			t.commit();
			cb({status :200 });
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