var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
	var role = "admin";
	if(login === req.config.adminAuth.login && password === req.config.adminAuth.pass){
		token = uuid.v1();
		req.auth.push({
			token : token,
			role : role,
			username : "Admin"
		});
		return res.json({
			token : token,
			role : role,
			username : "administrator"
		});
	}else{
		return res.sendStatus(403);
	}
};