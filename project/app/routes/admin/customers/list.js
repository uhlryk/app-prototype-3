module.exports = function(req, res, next){
	req.models.Customer.findAll({
		include: [ req.models.CustomerAccount ]
	})
	.then(function(customers) {
		res.json(customers);
	});
};