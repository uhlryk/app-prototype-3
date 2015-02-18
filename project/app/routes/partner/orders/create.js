module.exports = function(req, res , next) {
	var HC_percentageApp = 2;
	var HC_conv_cash_score = 12.5;
	req.models.sequelize.transaction().then( function(t) {
		var data = req.body;
		var subOrders = data.subOrders;
		var sumSubOrder = 0;
		var sumMoneyScore = 0;

		subOrders.forEach(function(subOrder){
			subOrder.moneyScore = subOrder.moneySubOrder * subOrder.percentageScore / 100;
			sumMoneyScore += 1 * subOrder.moneyScore;
			sumSubOrder += 1 * subOrder.moneySubOrder;
		});
		var moneyApp = sumSubOrder * HC_percentageApp / 100;

		var cardModel, orderModel, partnerAccountModel;
		return 	req.models.Card.find({
			where : {
				ean_code : data.order.ean,
			}
		}, {transaction : t})
		.then(function(card){
			cardModel = card;
			if(card === null) {
				throw new Error("brak karty");
			}
			return true;
		})
		.then(function(){
			return 	req.models.PartnerAccount.find({
				include : [
					req.models.Place, req.models.Partner
				],
				where : {
					id : req.user.id,
					'Places.id' : data.order.place
				}
			}, {transaction : t});
		})
		.then(function(partnerAccount){
			partnerAccountModel = partnerAccount;
			if(partnerAccount === null){
				throw new Error("brak konta partnera");
			}
		})
		.then(function(){
			return req.models.Order.create({
				order_code : data.order.orderCode,
				order_document : "HC",
				date_use : data.order.dateUse,
				money_order : sumSubOrder,
				money_score : sumMoneyScore,
				percentage_app : HC_percentageApp,
				money_app : moneyApp,
				CardId : cardModel.id,
				PartnerAccountId : partnerAccountModel.id
			}, {transaction : t});
		})
		.then(function(order){
			orderModel = order;
			return req.models.sequelize.Promise.map(subOrders, function(v, i) {
				return req.models.SubOrder.create({
					money_suborder : v.moneySubOrder,
					percentage_score : v.percentageScore,
					money_score : v.moneyScore,
					OrderId : order.id,
					CardId : cardModel.id
				}, { transaction: t });
			});
		})
		.then(function(){
			return req.models.Score.create({
				score : sumMoneyScore * HC_conv_cash_score,
				CardId : cardModel.id,
			},{transaction : t})
			.then(function(score){
				score.setOrder(orderModel, {transaction : t});
			})
			;
		})
		.then(function(){
			return req.models.Payment.create({
				money : sumMoneyScore,
				type : 'order_score',
				PartnerId : partnerAccountModel.Partner.id,
				PartnerAccountId : partnerAccountModel.id,
				OrderId : orderModel.id,
				PlaceId : data.order.place
			}, {transaction : t})
			;
		})
		.then(function(){
			return req.models.Payment.create({
				money : moneyApp,
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