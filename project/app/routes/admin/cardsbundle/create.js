var bcrypt = require('bcrypt');
var ean13Card = require("./../../../libs/ean13Card");
module.exports = function(req, res, next){
	var data = req.body;
	var b, e;
	if(data.beginEAN > data.endEAN){
		b = data.endEAN;
		e = data.beginEAN;
	}else{
		e = data.endEAN;
		b = data.beginEAN;
	}
	var diffNumber = e - b + 1;
	if(diffNumber > 100){
		return res.sendStatus(406);
	}
	var num = [];
	num.length = diffNumber;

	req.models.sequelize.transaction().then(function (t) {
		return req.models.CardBundle.create({
			beginEAN : data.beginEAN,
			endEAN : data.endEAN
		}, {transaction : t})
		.then(function(cardBundle){
			var array = [];
			return req.models.sequelize.Promise.map(num, function(v, i) {
				console.log(i + "  " + (b + i));
				var ean = b + i;
				return req.models.Card.create({
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
			res.sendStatus(200);
		})
		.catch(function(err){
			t.rollback();
			console.log(err);
			res.sendStatus(406);
		})
		;
	});

};