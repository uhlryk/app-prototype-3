module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var orderList;
	var where = {};
	var whereCard = {};
	var partnerAccountId = Number(query.partnerAccountId);
	if(Number.isNaN(partnerAccountId) === false) {
		where.PartnerAccountId = partnerAccountId;
	}
	var customerId = Number(query.customerId);
	if(Number.isNaN(customerId) === false) {
		whereCard.CustomerId = customerId;
	}
	models.Order.findAll({
		where : where,
		limit: size,
		offset: (page-1)*size,
		attributes: ['order_code', 'money_order', 'money_app', 'money_score', 'order_document'],
		include: [
			{
				model : models.Card,
				attributes: ['ean_code', 'CustomerId'],
				where : whereCard,
				include : [{
					model : models.Customer,
					attributes : ['firmname'],
				}]
			}, {
				model : models.Score,
				attributes: ['score'],
			}, {
				model : models.PartnerAccount,
				attributes: ['email','PartnerId'],
				include : [{
					attributes: ['firmname'],
					model : models.Partner
				}]
			}, {
				model : models.Place,
				attributes: ['name'],
			}
		],
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