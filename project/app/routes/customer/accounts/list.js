module.exports = function(req, res, next){
	var bundleId = Number(req.params.bundleId);
	req.models.CustomerAccount.findAll({
		where : {
			'CustomerId' : req.user.data.customerId
		},
		include : [req.models.Customer, req.models.Card]
	})
	.then(function(accounts) {
		res.json(accounts);
	});
};