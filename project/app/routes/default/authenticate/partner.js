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
			return res.sendStatus(403);
		}
		if(bcrypt.compareSync(password, partnerAccount.dataValues.password)){
			console.log("SYNC");
			var token = uuid.v1();
			var data = {
				token : token,
				role : role,
				id : partnerAccount.id,
				username : partnerAccount.login,
				data : {
					firmname : partnerAccount.Partner.firmname,
					places : partnerAccount.Places
				}
			};
			req.auth.push(JSON.parse(JSON.stringify(data)));
			// console.log(data);
			return res.json(data);
		}else{
			return res.sendStatus(403);
		}
	});
};