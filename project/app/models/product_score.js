// TO DO !!!
/*jslint node: true */
"use strict";
/**
 * Zawiera powiązanie między produktem a punktami, jest to odpowiednik zamówienia, tu musi pojawić się kod do realizacji zamówienia i określenie stan czy zostało zrealizowane
 */
module.exports = function(sequelize, DataTypes) {
	var ProductScore = sequelize.define("ProductScore", {
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				ProductScore.belongsTo(models.Score);
				ProductScore.belongsTo(models.Product);
			}
		}
	});
	return ProductScore;
};