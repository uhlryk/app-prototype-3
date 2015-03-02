module.exports = function(config, cb, models){
	var data = config.data;
	var percentageApp = config.percentageApp;
	var convCashScore = config.convCashScore;//przelicza ile kasa warta jest punktów
	var partnerAccountId = Number(config.partnerAccountId);
	models.sequelize.transaction().then( function(t) {
		var subOrders = data.subOrders;
		var sumSubOrder = 0;
		var sumMoneyScore = 0;
		subOrders.forEach(function(subOrder){
			subOrder.moneyScore = subOrder.moneySubOrder * subOrder.percentageScore / 100;
			sumMoneyScore += 1 * subOrder.moneyScore;
			sumSubOrder += 1 * subOrder.moneySubOrder;
		});
		var moneyApp = sumSubOrder * percentageApp / 100;

		var cardModel, orderModel, partnerAccountModel;
		return 	models.Card.find({
			where : {
				ean_code : data.order.ean,
			}
		}, {transaction : t})
		.then(function(card){
			cardModel = card;
			if(card === null) {
				throw {code : "WRONG_CARD"};
			}
			return true;
		})
		.then(function(){
			return 	models.PartnerAccount.find({
				include : [
					models.Place, models.Partner
				],
				where : {
					id : partnerAccountId,
					'Places.id' : data.order.place
				}
			}, {transaction : t});
		})
		.then(function(partnerAccount){
			partnerAccountModel = partnerAccount;
			if(partnerAccount === null){
				console.log("błędny partner");
				cb({status :500});
				return;
			}
		})
		.then(function(){
			return models.Order.create({
				order_code : data.order.orderCode,
				order_document : "HC",
				date_use : data.order.dateUse,
				money_order : sumSubOrder,
				money_score : sumMoneyScore,
				percentage_app : percentageApp,
				money_app : moneyApp,
				CardId : cardModel.id,
				PartnerAccountId : partnerAccountModel.id,
				PlaceId : data.order.place
			}, {transaction : t});
		})
		.then(function(order){
			orderModel = order;
			return models.sequelize.Promise.map(subOrders, function(v, i) {
				return models.SubOrder.create({
					money_suborder : v.moneySubOrder,
					percentage_score : v.percentageScore,
					money_score : v.moneyScore,
					OrderId : order.id,
					CardId : cardModel.id
				}, { transaction: t });
			});
		})
		.then(function(){
			return models.Score.create({
				score : sumMoneyScore * convCashScore,
				CardId : cardModel.id,
			},{transaction : t})
			.then(function(score){
				score.setOrder(orderModel, {transaction : t});
			})
			;
		})
		.then(function(){
			return models.Payment.create({
				money : -sumMoneyScore,
				type : 'order_score',
				PartnerId : partnerAccountModel.Partner.id,
				PartnerAccountId : partnerAccountModel.id,
				OrderId : orderModel.id,
				PlaceId : data.order.place
			}, {transaction : t})
			;
		})
		.then(function(){
			return models.Payment.create({
				money : -moneyApp,
				type : 'order_app',
				PartnerId : partnerAccountModel.Partner.id,
				PartnerAccountId : partnerAccountModel.id,
				OrderId : orderModel.id,
				PlaceId : data.order.place
			}, {transaction : t})
			;
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