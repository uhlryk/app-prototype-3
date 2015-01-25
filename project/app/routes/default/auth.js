/**
 * Motody logowanie partnera, klienta, admina, który typ podajemy w parametrze,
 */
var uuid = require('node-uuid');
module.exports = function(req, res, next) {
	console.log(req.body);
	var type = req.body.type;
	var login = req.body.login;
	var password = req.body.password;
	var result = false;
	switch(type){
		case "admin":
			result = authenticateAdmin(login, password, req.config.adminAuth);
		break;
	}
	if(result){
		var token = uuid.v1();
		req.auth.push({
			token : token,
			type : type,
			username : "Admin"
		});
		// res.json({
		// 	token : token,
		// 	type : type,
		// 	username : "Admin"
		// });
		res.send(200);
	}else{
		res.send(401);
	}
};
function authenticateAdmin(login, password, adminAuth){
	if(login === adminAuth.login && password === adminAuth.pass){
		return true;
	}else{
		return false;
	}
}
function authenticatePartner(login, password){

}
function authenticateCustomer(login, password){

}