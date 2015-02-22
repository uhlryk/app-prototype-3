/*jslint node: true */
"use strict";

module.exports = function(config){
	var fs        = require("fs");
	var path      = require("path");
	var actions = {};
	var controllerList = fs.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	});
	controllerList.forEach(function(controller) {
		actions[controller] = {};
		console.log(path.join(__dirname, controller));
		var actionPath = path.join(__dirname, controller);
		fs.readdirSync(actionPath)
		.filter(function(file) {
			return (file.indexOf(".") !== 0);
		})
		.forEach(function(file) {
			/**
			 * plik ma formę name1_name2.js
			 * w pierwszej kolejności usuwamy .js
			 * mamy więc name1_name2
			 * następnie zamieniamy to na name1_Name2
			 * na końcu usuwamy _
			 */
			file = file.replace(/\..*$/,"");
			var fileName = file.replace(/_[a-z]/, function(v){
				return v.toUpperCase();
			})
			.replace(/_/,"");
			actions[controller][fileName] = require(path.join(actionPath, file));
		});
	});
	console.log(actions);
	return actions;
};