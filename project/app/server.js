/*jslint node: true */
"use strict";
module.exports = function(){
	var express = require("express");
	var path = require('path');
	var config = require(path.join(__dirname, '/../config/config'));
	var bodyParser = require("body-parser"),
	morgan = require("morgan"),
	models, actions,
	installDbData = require("./install/installDb"),
	redis = require("redis").createClient()
	;
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
			actions = require("./actions")({
				models : models
			});
			app.use(function(req, res, next){
				req.models = models;
				req.actions = actions;
				req.redis = redis;
				next();
			});

			return this;
		},
		setMiddleware : function(){
			app.use(function(req, res, next){
			/**
			 *  przez ten middleware realizujemy wszystkie responsy z serwera
			 */
				res.sendData = function(responseData){
					if(responseData.status === 200 && responseData.data){
						res.json(responseData.data);
					} else if(responseData.code){
						res.status(responseData.status).send(responseData.code);
					} else {
						res.sendStatus(responseData.status);
					}
				};
				next();
			});
			app.use(morgan(config.logType));
			app.use(bodyParser.urlencoded({"extended":true}));
			app.use(bodyParser.json());
			app.use(function(req, res, next) {
				res.header('Access-Control-Allow-Origin', config.cors.origin);
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
				res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Token, Accept, Origin, X-Requested-With');
				next();
			});
			return this;
		},
		setRouter : function(){
			app.options("*", function(req, res, next){
				console.log("wejscie dla options");
				res.sendStatus(200);
			});
			app.use('/default', require('./routes/default/default'));
			app.use('/admin', require('./routes/admin/admin'));
			app.use('/partner', require('./routes/partner/partner'));
			app.use('/customer', require('./routes/customer/customer'));
			app.use("/*", function(req ,res, next){
				res.send("Jesteśmy");
				res.end();
			});
			return this;
		},
		run : function(){
			models.sequelize.sync().then(function () {
				installDbData(models);
				app.listen(port, function() {
					console.log('Express server listening on port ' + port);
				});
			});
			return this;
		}
	};
};
