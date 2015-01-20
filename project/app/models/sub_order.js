/*jslint node: true */
"use strict";
/**
 * Jest to wyszczególniona część zamówienia która ma określony przelicznik na punkty.
 * Np mamy order na 1000zł i chcemy by 300zł było przeliczane 4% a 700zł było przeliczane 3%. Wynika to z tego że niektóre produkty mogą być promocyjnie inaczej liczone
 */
module.exports = function(sequelize, DataTypes) {
	var SubOrder = sequelize.define("SubOrder", {
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				SubOrder.belongsTo(models.Order);
				SubOrder.belongsTo(models.Score);
				SubOrder.belongsTo(models.Payment);
			}
		}
	});
	return SubOrder;
};