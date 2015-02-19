module.exports = function(req, res, next){
	var id = Number(req.params.id);
	req.models.Customer.find({
		include : [
			req.models.CustomerAccount, req.models.Card
		],
		where : {
			id : id
		}
	})
	.then(function(customer) {
		res.json(customer);
	});
};