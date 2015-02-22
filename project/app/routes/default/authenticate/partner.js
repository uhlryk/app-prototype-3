var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
	var login = req.body.login;
	var password = req.body.password;
	var role = "partner";
	req.models.PartnerAccount.find({
		include : [
			req.models.Place,
			req.models.Partner
		],
		where: { email: login }
	})
	.then(function(partnerAccount) {
		if(partnerAccount === null){
			return res.status(422).send("INCORRECT_LOGIN_PASSWORD");
		}
		if(bcrypt.compareSync(password, partnerAccount.dataValues.password)){
			var token = uuid.v1();
			var data = {
				token : token,
				role : role,
				id : partnerAccount.id,
				username : partnerAccount.email,
				data : {
					partnerId : partnerAccount.Partner.id,
					firmname : partnerAccount.Partner.firmname,
					places : partnerAccount.Places
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