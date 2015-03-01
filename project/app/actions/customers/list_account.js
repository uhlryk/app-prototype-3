module.exports = function(config, cb, models){
	var query = config.query;
	var page = Number(query.page) || 1;
	var size = 10;
	var customerAccountList;
	var where = {};
	var customerId = Number(query.customerId);
	if(Number.isNaN(customerId) === false) {
		where.CustomerId = customerId;
	}
	models.CustomerAccount.findAll({
		where : where,
		include : [models.Customer, models.Card]
	})
	.then(function(customerAccounts) {
		customerAccountList = customerAccounts;
		return models.CustomerAccount.count({
			where : where
		});
	})
	.then(function(count) {
		cb({status :200, data : {list : customerAccountList, size : count}});
	});
};