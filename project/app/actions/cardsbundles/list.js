module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var cardBundleList;
	models.CardBundle.findAll({
		limit: size,
		offset: (page-1)*size,
	})
	.then(function(cardBundle) {
		cardBundleList = cardBundle;
		return models.CardBundle.count();
	})
	.then(function(count){
		cb({status :200, data : {list : cardBundleList, size : count}});
	});
};