/*jslint node: true */
"use strict";
/**
 * Jest to zgrupowanie kart utworzonych przez admina jako pakiet.
 */
module.exports = function(sequelize, DataTypes) {
	var CardBundle = sequelize.define("CardBundle", {
		beginEAN : {type: DataTypes.BIGINT(12)},
		endEAN : {type: DataTypes.BIGINT(12)}
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				CardBundle.hasMany(models.Card);
			}
		}
	});
	return CardBundle;
};