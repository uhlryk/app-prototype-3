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
			console.log("SYNC");
			var token = uuid.v1();
			req.auth.push({
				token : token,
				role : role,
				username : customerAccount.login
			});
			return res.json({
				token : token,
				role : role,
				username : customerAccount.login
			});
		}else{
			return res.sendStatus(403);
		}
	});
};