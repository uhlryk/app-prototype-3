/*jslint node: true */
"use strict";
/**
 * Zawiera punkty przypisane do danej karty, w przypadku zakupu nagrody będzie zawierać ujemne punkty i powiązanie z tabelą Product
 */
module.exports = function(sequelize, DataTypes) {
	var Score = sequelize.define("Score", {
		score: {type: DataTypes.DECIMAL(6,4)},
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Score.belongsTo(models.Card);
				Score.hasOne(models.Order);
				Score.hasOne(models.ProductScore);
			}
		}
	});
	return Score;
};