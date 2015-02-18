var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
	var role = "admin";
	if(login === req.config.adminAuth.login && password === req.config.adminAuth.pass){
		token = uuid.v1();
		var data = {
			token : token,
			role : role,
			username : "administrator"
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
};