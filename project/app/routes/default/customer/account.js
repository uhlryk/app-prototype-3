var bcrypt = require('bcrypt');
module.exports = function(req, res, next){
	var data = req.body;
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
				return customer.setCustomerAccounts([customerAccount], {transaction : t});
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