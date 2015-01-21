module.exports = function(req, res, next){
	var newpost = req.body;
	req.data.push(newpost);
	res.sendStatus(200);
};