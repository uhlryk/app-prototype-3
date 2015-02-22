var bcrypt = require('bcrypt');
module.exports = function(req, res, next){
	var data = req.body;
	console.log(data);
	var customerModel;
	req.models.sequelize.transaction().then(function (t) {
		return req.models.CustomerAccount.find({
			where : {
				email : data.account.login
			}
		}, {transaction : t})
		.then(function(customerAccount){
			if(customerAccount !== null){
				throw {code : "DUPLICATE_USER"};
			}
		})
		.then(function(){
			return req.models.CustomerAccount.create({
				type : "child",
				status : "active",
				email : data.account.login,
				CustomerId : req.user.data.customerId,
				password : bcrypt.hashSync(data.account.password, 8)
			}, {transaction : t})
			;
		})
		.then(function(){
			t.commit();
			res.sendStatus(201);
		})
		.catch(function(err){
			t.rollback();
			if (err.code){
				res.status(422).send(err.code);
			} else{
				res.sendStatus(500);
			}
			console.log(err);
		})
		;
	});

};