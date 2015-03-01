module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var customerList;
	models.Customer.findAll({
		limit: size,
		offset: (page-1)*size,
		include: [ models.CustomerAccount ]
	})
	.then(function(customers) {
		customerList = customers;
		return models.Customer.count();
	})
	.then(function(count) {
		cb({status :200, data : {list : customerList, size : count}});
	});
};