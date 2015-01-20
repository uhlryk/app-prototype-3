/*jslint node: true */
"use strict";
/**
 * Jest to zgrupowanie kart utworzonych przez admina jako pakiet.
 */
module.exports = function(sequelize, DataTypes) {
	var CardBundle = sequelize.define("CardBundle", {
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				CardBundle.hasMany(models.Card);
			}
		}
	});
	return CardBundle;
};