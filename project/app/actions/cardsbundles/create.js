var bcrypt = require('bcrypt');
var ean13Card = require("./../../libs/ean13Card");
module.exports = function(config, cb, models){
	var data = config.data;
	var b, e;
	/**
	 * TRUE jeśli oba ean to tylko liczby i obie muszą mieć 12 znaków                                                                                                             [description]
	 */
	if(!Number.isNaN(data.beginEAN)&&isFinite(data.beginEAN)&&!Number.isNaN(data.beginEAN)&&isFinite(data.beginEAN)&&data.beginEAN.length === 12 && data.endEAN.length === 12){

	}
	else{
		console.log("błędne wartości");
		cb({status :500});
		return;
	}
	if(data.beginEAN > data.endEAN){
		b = Number(data.endEAN);
		e = Number(data.beginEAN);
	}else{
		e = Number(data.endEAN);
		b = Number(data.beginEAN);
	}
	var diffNumber = e - b + 1;
	if(diffNumber > 100){
		cb({status :422, code : "BIG_CARD_RANGE"});
		return;
	}
	var num = [];
	num.length = diffNumber;

	models.sequelize.transaction().then(function (t) {
		return models.CardBundle.create({
			beginEAN : data.beginEAN,
			endEAN : data.endEAN
		}, {transaction : t})
		.then(function(cardBundle){
			var array = [];
			return models.sequelize.Promise.map(num, function(v, i) {
				var ean = b + i;
				return models.Card.create({
					ean_code : "" + ean + ean13Card.getChecksum(ean),
					code : Math.floor((Math.random() * 100000) + 100000).toString().substr(1),
					status : "inactive",
					CardBundleId : cardBundle.id
				}, { transaction: t });
			})
			;
		})
		.then(function(){
			t.commit();
			cb({status :200 });
		})
		.catch(models.Sequelize.ValidationError, function (err) {
			t.rollback();
			if(err.name === 'SequelizeUniqueConstraintError'){
				cb({status :422, code : "DUPLICATE_CARD"});
			} else {
				cb({status :500});
			}
			console.log(err);
		})
		.catch(function(err){
			t.rollback();
			console.log(err);
			if (err.code){
				cb({status :422, code : err.code});
			} else{
				cb({status :500});
			}
		})
		;
	});

};