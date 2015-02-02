var bcrypt = require('bcrypt');
module.exports = function(req, res, next){
	var data = req.body;
	req.models.sequelize.transaction().then(function (t) {
		return req.models.PartnerAccount.create({
			type : "parent",
			status : "active",
			email : data.account.login,
			password : bcrypt.hashSync(data.account.password, 8)
		}, {transaction : t})
		.then(function(partnerAccount){
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
			}, {transaction : t})
			.then(function(partner){
				return partner.setPartnerAccounts([partnerAccount], {transaction : t})
				.then(function(){
					return req.models.Place.create({
						name : data.location
					}, {transaction : t})
					.then(function(place){
						return place.setPartnerAccounts([partnerAccount], {transaction : t})
						.then(function(){
							return partner.setPlaces([place], {transaction : t});
						})
						;
					})
					;
				})
				;
			})
			;
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