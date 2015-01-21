module.exports = function(req, res, next){
	var id = Number(req.params.id);
	var showpost;
	req.data.forEach(function(post){
		if(post.id === id){
			showpost = post;
		}
	});
	res.json(showpost);
};