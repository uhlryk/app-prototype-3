module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var orderList;
	var where = {};
	var partnerId = Number(query.partnerAccountId);
	if(Number.isNaN(partnerId) === false) {
		where.PartnerAccountId = partnerAccountId;
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
			where : where
		});
	})
	.then(function(count) {
		cb({status :200, data : {list : orderList, size : count}});
	});
};