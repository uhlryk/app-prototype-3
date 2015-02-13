module.exports = function(req, res, next){
	req.models.Location.getTree()
	.then(function(rootTree) {
		res.json(rootTree);
	});
};