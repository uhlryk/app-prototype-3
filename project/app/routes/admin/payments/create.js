var bcrypt = require('bcrypt');
module.exports = function(req, res, next){
	var data = req.body;
	req.models.sequelize.transaction().then(function (t) {
		return 	req.models.Partner.find({
			include : [
				req.models.Place
			],
			where : {
				id : data.partnerId,
				'Places.id' : data.placeId
			}
		}, {transaction : t})
		.then(function(partner){
			if(partner === null)
			{
				throw new Error("brak partnera");
			}else{
				return req.models.Payment.create({
					money : data.money,
					PartnerId : data.partnerId,
					PlaceId : data.placeId,
					date_use : data.date_use,
					type : data.type,
					title : data.title
				}, {transaction : t})
				;
			}
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