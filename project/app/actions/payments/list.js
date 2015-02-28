module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var paymentList;
	var where = {};
	var partnerId = Number(query.partnerId);
	if(Number.isNaN(partnerId) === false) {
		where.PartnerId = partnerId;
	}
	models.Payment.findAll({
		limit: size,
		offset: (page-1)*size,
		where : where,
		include: [models.Place, models.PartnerAccount, models.Order, models.Partner]
	})
	.then(function(payments) {
		paymentList = payments;
		return models.Payment.count({
			where : where
		});
	})
	.then(function(count) {
		cb({status :200, data : {list : paymentList, size : count}});
	});
};