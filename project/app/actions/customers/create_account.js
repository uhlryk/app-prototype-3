var bcrypt = require('bcrypt');
module.exports = function(config, cb, models){
	var data = config.data;
	var query = config.query;
	var customerId = Number(query.customerId);
	var customerModel;
	models.sequelize.transaction().then(function (t) {
		return models.CustomerAccount.find({
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
			return models.CustomerAccount.create({
				type : "child",
				status : "active",
				email : data.account.login,
				CustomerId : customerId,
				password : bcrypt.hashSync(data.account.password, 8)
			}, {transaction : t})
			;
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