/*jslint node: true */
"use strict";
module.exports = function(){
	var express = require("express");
	var path = require('path');
	var config = require(path.join(__dirname, '/../config/config'));
	var bodyParser = require("body-parser"),
	morgan = require("morgan"),
	models;
	var app = express();
	var port = process.env.PORT || config.app.port;
	return {
		getApp : app,
		setConfig : function(){
			app.use(function(req, res, next){
				req.config = config;
				next();
			});
			models = require("./models")(config.db.normal);
			return this;
		},
		setMiddleware : function(){
			app.use(function(req, res, next){
				req.auth = [];
				next();
			});
			app.use(morgan(config.logType));
			app.use(bodyParser.urlencoded({"extended":true}));
			app.use(bodyParser.json());
			app.use(function(req, res, next) {
				res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
				res.header('Access-Control-Allow-Headers', 'Content-Type');
				next();
			});
			return this;
		},
		setRouter : function(){
			app.use('/default', require('./routes/default'));
			app.use('/admin', require('./routes/admin'));
			app.use("/*", function(req ,res, next){
				res.send("Jesteśmy");
				res.end();
			});
			// app.use('/customer', require('./routes/customer').middleware);
			// app.use('/partner', require('./routes/partner').middleware);
			return this;
		},
		run : function(){
			models.sequelize.sync().then(function () {
				app.listen(port, function() {
					console.log('Express server listening on port ' + port);
				});
			});
			return this;
		}
	};
};
