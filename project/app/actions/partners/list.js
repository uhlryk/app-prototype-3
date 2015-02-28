module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var partnerList;
	models.Partner.findAll({
		limit: size,
		offset: (page-1)*size,
		include: [ models.PartnerAccount, models.Place ]
	})
	.then(function(partners) {
		partnerList = partners;
		return models.Partner.count();
	})
	.then(function(count) {
		cb({status :200, data : {list : partnerList, size : count}});
	});
};