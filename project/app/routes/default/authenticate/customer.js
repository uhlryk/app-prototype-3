var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
	var role = "customer";
	req.models.CustomerAccount.find({
		include : [req.models.Customer],
		where: { email: login }
	})
	.then(function(customerAccount) {
		if(customerAccount === null){
			return res.status(422).send("INCORRECT_LOGIN_PASSWORD");
		}
		if(bcrypt.compareSync(password, customerAccount.dataValues.password)){
			var token = uuid.v1();
			var data = {
				token : token,
				role : role,
				id : customerAccount.id,
				username : customerAccount.login,
				data : {
					customerId : customerAccount.Customer.id,
					firmname : customerAccount.Customer.firmname
				}
			};
			req.redis.set('t_' + token, JSON.stringify(data), function(error, result) {
					if (error) {
						console.log(error);
						return res.sendStatus(500);
					} else {
						return res.json(data);
					}
			});
		}else{
			return res.status(422).send("INCORRECT_LOGIN_PASSWORD");
		}
	});
};