module.exports = function(req, res, next){
	var id = Number(req.params.id);
	var updateIndex;
	req.data.forEach(function(post, index){
		if(post.id === id){
			updateIndex = index;
		}
	});
	if(updateIndex !== undefined) {
		req.data.splice(updateIndex,1);
		res.sendStatus(200);
	}else{
		res.sendStatus(400);
	}
};