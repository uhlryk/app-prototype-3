var bcrypt = require('bcrypt');
module.exports = function(req, res, next){
	var data = req.body;
	var cardModel;
	req.models.sequelize.transaction().then(function (t) {
		return req.models.Card.find({
			where : {
				ean_code : data.card.ean,
				code : data.card.code,
				status : "inactive"
			}
		}, {transaction : t})
		.then(function(card){
			cardModel = card;
			if(card === null){
				throw new Error("taka karta nie istnieje");
			}
		})
		.then(function(){
			return cardModel.updateAttributes({
				status : "active",
				CustomerId : req.user.data.customerId,
				name : data.card.name
			}, {transaction : t});
		})
		.then(function(){
			return cardModel.addCustomerAccount([req.user.id], {transaction : t});
		})
		.then(function(){
			t.commit();
			res.sendStatus(200);
		})
		.catch(function(err){
			t.rollback();
			console.log("BŁĄD");
			console.log(err);
			console.log("BŁĄD");
			res.sendStatus(406);
		})
		;
	});

};