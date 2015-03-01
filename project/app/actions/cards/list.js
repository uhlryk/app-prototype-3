module.exports = function(config, cb, models){
	var query = config.query;
	var bundleId = Number(query.bundleId);
	var customerId = Number(query.customerId);
	var page = Number(query.page) || 1;
	var size = 10;
	var where = {};
	var cardList;
	if(Number.isNaN(bundleId) === false) {
		where.CardBundleId = bundleId;
	}
	if(Number.isNaN(customerId) === false) {
		where.CustomerId = customerId;
	}
	models.Card.findAll({
		where : where,
		limit: size,
		offset: (page-1)*size,
		include : [models.Customer, models.CardBundle]
	})
	.then(function(cards) {
		cardList = cards;
		return models.Card.count({
			where : where
		});
	})
	.then(function(count){
		cb({status :200, data : {list : cardList, size : count}});
	});
};