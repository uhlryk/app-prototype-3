module.exports = function(config, cb, models){
	var query = config.query;
	var customerId = Number(query.customerId);
	var customerAccountId = Number(query.customerAccountId);
	var data = config.data;
	var cardModel;
	models.sequelize.transaction().then(function (t) {
		return models.Card.find({
			where : {
				ean_code : data.card.ean,
				code : data.card.code,
				status : "inactive"
			}
		}, {transaction : t})
		.then(function(card){
			cardModel = card;
			if(card === null){
				throw {code : "WRONG_CARD"};
			}
		})
		.then(function(){
			return cardModel.updateAttributes({
				status : "active",
				CustomerId : customerId,
				name : data.card.name
			}, {transaction : t});
		})
		.then(function(){
			return cardModel.addCustomerAccount([customerAccountId], {transaction : t});
		})
		.then(function(){
			t.commit();
			cb({status :200 });
		})
		.catch(function(err){
			t.rollback();
			console.log(err);
			if (err.code){
				cb({status :422, code : err.code});
			} else{
				cb({status :500});
			}
		});
	});

};