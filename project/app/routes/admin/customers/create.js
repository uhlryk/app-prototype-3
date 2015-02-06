var bcrypt = require('bcrypt');
module.exports = function(req, res, next){
	var data = req.body;
	console.log(data);
	req.models.sequelize.transaction().then(function (t) {
		console.log(bcrypt.hashSync(data.account.password, 8));
		console.log(bcrypt.hashSync(data.account.password, 8).length);
		return req.models.CustomerAccount.create({
			type : "parent",
			status : "active",
			email : data.account.login,
			password : bcrypt.hashSync(data.account.password, 8)
		}, {transaction : t})
		.then(function(customerAccount){
			return req.models.Customer.create({
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
			.then(function(customer){
				console.log("inner");
				return customer.setCustomerAccounts([customerAccount], {transaction : t});
			})
			.then(function(){
				if(data.card && data.card.length > 0){
					return req.models.sequelize.Promise.map(data.card, function(v, i) {
						return req.models.Card.find({
							where : {
								ean_code : v.ean,
								code : v.code
							}
						}, {transaction : t})
						.then(function(card){
							if(card === null) {
								throw new Error("incorrect EAN13 or code");
							} else {
								return card.addCustomerAccount(customerAccount, {transaction : t })
								.then(function(){
									return card.update({
										status : "active"
									}, {
										where : { id : card.id },
										transaction : t
									})
									;
								})
								;
							}
						})
						;
					})
					;
				} else{
					return req.models.Card.find({
						include : [
							req.models.CardBundle
						],
						where : {
							status : "inactive",
							'CardBundle.type' : data.type
						}
					}, {transaction : t})
					.then(function(card) {
						if(card === null)
						{
							throw new Error("brak karty");
						}else{
							return card.addCustomerAccount(customerAccount, {transaction : t })
							.then(function(){
								return card.update({
									status : "active"
								}, {
									where : { id : card.id },
									transaction : t
								})
								;
							})

							;
						}
					});
				}
			})
			;
		})
		.then(function(){
			console.log("outher");
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