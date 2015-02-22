var bcrypt = require('bcrypt');
module.exports = function(config, cb){
	var data = config.data;
	var customerAccountModel, customerModel;
	config.models.sequelize.transaction().then(function (t) {
		return config.models.CustomerAccount.create({
			type : "parent",
			status : "active",
			email : data.account.login,
			password : bcrypt.hashSync(data.account.password, 8)
		}, {transaction : t})
		.then(function(customerAccount){
			customerAccountModel = customerAccount;
		})
		.then(function(){
			return config.models.Customer.create({
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
		.then(function(customer){
			customerModel = customer;
			return customer.setCustomerAccounts([customerAccountModel], {transaction : t});
		})
		.then(function(){
			var cardModel;
			if(data.card && data.card.length > 0){
				return config.models.sequelize.Promise.map(data.card, function(v, i) {
					return config.models.Card.find({
						where : {
							ean_code : v.ean,
							code : v.code,
							status : "inactive"
						}
					}, {transaction : t})
					.then(function(card){
						cardModel = card;
						if(card === null){
							throw {code : "WRONG_CARD"};
						}
					})
					.then(function(){
						return cardModel.addCustomerAccount(customerAccountModel, {transaction : t });
					})
					.then(function(){
						return card.update({
							status : "active",
							CustomerId : customerModel.id
						}, {
							where : { id : card.id },
							transaction : t
						}) ;
					});
				}) ;
			} else{
				return config.models.Card.find({
					include : [
						config.models.CardBundle
					],
					where : {
						status : "inactive",
						'CardBundle.type' : data.type
					}
				}, {transaction : t})
				.then(function(card) {
					cardModel = card;
					if(card === null){
						throw {code : "LACK_OF_CARD"};
					}
				})
				.then(function(){
					return cardModel.addCustomerAccount(customerAccountModel, {transaction : t });
				})
				.then(function(){
					return cardModel.update({
						status : "active",
						CustomerId : customerModel.id
					}, {
						where : { id : cardModel.id },
						transaction : t
					}) ;
				});
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
		})
		;
	});

};