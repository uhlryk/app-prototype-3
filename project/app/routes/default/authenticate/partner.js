var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
	var role = "partner";
	req.models.PartnerAccount.find({
		where: { email: login }
	})
	.then(function(partnerAccount) {
		if(partnerAccount === null){
			return res.sendStatus(403);
		}
		if(bcrypt.compareSync(password, partnerAccount.dataValues.password)){
			console.log("SYNC");
			var token = uuid.v1();
			req.auth.push({
				token : token,
				role : role,
				username : partnerAccount.login
			});
			return res.json({
				token : token,
				role : role,
				username : partnerAccount.login
			});
		}else{
			return res.sendStatus(403);
		}
	});
};