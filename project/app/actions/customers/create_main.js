var bcrypt = require('bcrypt');
/**
 * Zwracane 422:
 * DUPLICATE_USER już istnieje taki user o takim emailu
 * WRONG_CARD jak user poda kartę ale ona nie istnieje lub nie ma do niej praw
 * LACK_OF_CARDS przy generowaniu kart jak danego typu już nie ma
 */

module.exports = function(config, cb, models){
	var data = config.data;
	var customerAccountModel, customerModel;
	models.sequelize.transaction().then(function (t) {
		return models.CustomerAccount.create({
			type : "parent",
			status : "active",
			email : data.account.login,
			password : bcrypt.hashSync(data.account.password, 8)
		}, {transaction : t})
		.then(function(customerAccount){
			customerAccountModel = customerAccount;
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
			return models.Customer.create({
				status : "active",
				firmname : data.firm.firmname,
				nip : data.firm.nip,
				street_address : data.firm.street_address,
				house_address : data.firm.house_address,
				flat_address : data.firm.flat_address,
				zipcode_address : data.firm.zipcode_address,
				city_address : data.firm.city_address,
				is_mail_address : data.firm.is_mail_address?"yes":"no",
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
				return models.sequelize.Promise.map(data.card, function(v, i) {
					return models.Card.find({
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
				return models.Card.find({
					include : [{
						model: models.CardBundle,
						where : {
							type : data.type
						},
					}],
					where : {
						status : "inactive",
					}
				}, {transaction : t})
				.then(function(card) {
					cardModel = card;
					if(card === null){
						throw {code : "LACK_OF_CARDS"};
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