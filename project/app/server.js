/*jslint node: true */
"use strict";
module.exports = function(environment){
	var express = require("express");
	if(!environment){
		throw new Error("Zmienna środowiskowa NODE_APP nie została ustawiona");
	}
	var config = require("../config/conf_" + environment);
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
			app.use(morgan(config.logType));
			app.use(bodyParser.urlencoded({"extended":true}));
			app.use(bodyParser.json());
			return this;
		},
		setRouter : function(){
			app.use('/default', require('./routes/default'));
			app.use('/admin', require('./routes/admin'));
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
