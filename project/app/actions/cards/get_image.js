var codes = require("rescode");
codes.loadModules(["ean2", "ean5", "ean8", "ean13"]);
codes.loadModules(["qrcode"], { "eclevel":"M" , "version": "4", "scaleX": 2, "scaleY": 2} );
module.exports = function(config, cb, models){
	var where = {};
	var cardId = Number(config.cardId);
	if(cardId && Number.isNaN(cardId) === false) {
		where.id = cardId;
	}
	var type = config.type;
	var customerId = config.customerId;
	var customerAccountId = config.customerAccountId;
	if(customerId && Number.isNaN(customerId) === false) {
		where.CustomerId = customerId;
	}
	if(customerAccountId && Number.isNaN(customerAccountId) === false) {
		where.CustomerAccountId = customerAccountId;
	}
	console.log("AAA");
	console.log(where);
	models.Card.find({
		where : where,
	})
	.then(function(card) {
		if(card !== null){
			console.log(card.ean_code);
			cb({status :200, data : codes.create(type, String(card.ean_code))});
		} else {
			cb({status : 401});
		}
	})
	.catch(function(err){
		console.log(err);
		cb({status :500});
	});
};