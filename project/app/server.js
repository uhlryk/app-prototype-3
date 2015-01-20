/*jslint node: true */
"use strict";
module.exports = function(environment){
	var express = require("express");
	if(!environment){
		throw new Error("Zmienna środowiskowa NODE_APP nie została ustawiona");
	}
	var configPath = "../config/conf_" + environment;
	var config = require(configPath);
	var bodyParser = require("body-parser"),
	models = require("./models"),
	morgan = require("morgan");
	var app = express();
	var port = process.env.PORT || 3000;
	return {
		getApp : app,
		setConnection : function(){
			return this;
		},
		setMiddleware : function(){
			app.use(morgan(config.logType));
			app.use(function(req, res, next){
				req.config = config;
				next();
			});
			app.use(bodyParser.urlencoded({"extended":true}));
			app.use(bodyParser.json());
			return this;
		},
		setRouter : function(){
			app.use('/default', require('./routes/default'));
			// app.use('/customer', require('./routes/customer').middleware);
			// app.use('/partner', require('./routes/partner').middleware);
			// app.use('/admin', require('./routes/admin').middleware);
			return this;
		},
		run : function(){
			var server = models.sequelize.sync().then(function () {
				app.listen(port, function() {
			    console.log('Express server listening on port ' + port);
			  });
			});
			return this;
		}
	};
};
