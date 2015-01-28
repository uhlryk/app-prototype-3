/**
 * Motody logowanie partnera, klienta, admina, który typ podajemy w parametrze,
 */
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
module.exports = function(req, res, next) {
	console.log(req.body);
	var type = req.body.type;
	var login = req.body.login;
	var password = req.body.password;
	var result = false;
	var token;
	switch(type){
		case "admin":
			if(login === req.config.adminAuth.login && password === req.config.adminAuth.pass){
				token = uuid.v1();
				req.auth.push({
					token : token,
					type : type,
					username : "Admin"
				});
				return res.json({
					token : token,
					type : type,
					username : "Admin"
				});
			}else{
				return res.sendStatus(403);
			}
		break;
		case "partner" :
			req.models.PartnerAccount.find({
				where: { email: login }
			})
			.then(function(partnerAccount) {
				// console.log("znaleziono");
				// console.log(partnerAccount.dataValues);
				// console.log(password);
				if(bcrypt.compareSync(password, partnerAccount.dataValues.password)){
					console.log("SYNC");
					token = uuid.v1();
					req.auth.push({
						token : token,
						type : type,
						username : partner.login
					});
					return res.json({
						token : token,
						type : type,
						username : partner.login
					});
				}else{
					return res.sendStatus(403);
				}
			});
		break;
		default:
			return res.sendStatus(403);
		break;
	}
};