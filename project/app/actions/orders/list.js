module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var orderList;
	var where = {};
	var partnerAccountId = Number(query.partnerAccountId);
	if(Number.isNaN(partnerAccountId) === false) {
		where.PartnerAccountId = partnerAccountId;
	}
	var customerId = Number(query.customerId);
	if(Number.isNaN(customerId) === false) {
		where['Card.CustomerId'] = customerId;
	}
	models.Order.findAll({
		include: [
			{
				model : models.Card,
				include : [models.Customer]
			},
			models.Score, models.Payment,
			{
				model : models.PartnerAccount,
				include : [models.Partner]
			},
			models.Place
		],
		where : where
	})
	.then(function(orders) {
		orderList = orders;
		return models.Order.count({
			where : where,
			include: [models.Card]
		});
	})
	.then(function(count) {
		cb({status :200, data : {list : orderList, size : count}});
	});
};