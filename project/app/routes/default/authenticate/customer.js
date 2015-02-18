var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
	var role = "customer";
	req.models.CustomerAccount.find({
		where: { email: login }
	})
	.then(function(customerAccount) {
		if(customerAccount === null){
			return res.sendStatus(403);
		}
		if(bcrypt.compareSync(password, customerAccount.dataValues.password)){
			var token = uuid.v1();
			var data = {
				token : token,
				role : role,
				id : customerAccount.id,
				username : customerAccount.login
			};
			req.redis.set('t_' + token, JSON.stringify(data), function(error, result) {
					if (error) {
						return res.sendStatus(403, error);
					} else {
						return res.json(data);
					}
			});
		}else{
			return res.sendStatus(403);
		}
	});
};