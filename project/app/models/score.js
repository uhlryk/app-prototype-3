/*jslint node: true */
"use strict";
/**
 * Zawiera punkty przypisane do danej karty, w przypadku zakupu nagrody będzie zawierać ujemne punkty i powiązanie z tabelą Product
 */
module.exports = function(sequelize, DataTypes) {
	var Score = sequelize.define("Score", {
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				Score.belongsTo(models.Card);
				Score.hasOne(models.SubOrder);
				Score.hasOne(models.ProductScore);
			}
		}
	});
	return Score;
};