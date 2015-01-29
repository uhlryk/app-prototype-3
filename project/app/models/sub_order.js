/*jslint node: true */
"use strict";
/**
 * Jest to wyszczególniona część zamówienia która ma określony przelicznik na punkty.
 * Np mamy order na 1000zł i chcemy by 300zł było przeliczane 4% a 700zł było przeliczane 3%. Wynika to z tego że niektóre produkty mogą być promocyjnie inaczej liczone
 * percentage_score oprocentowanie z którego generowane są punkty customera, dla danego subordera
 * money_score wartość pieniędzy/punktów określonych w suborderze
 * Zakładamy przelicznik punkty klienta do kosztów partnera jako 1:1  jeden punkt jest równy złotówce kosztów
 */
module.exports = function(sequelize, DataTypes) {
	var SubOrder = sequelize.define("SubOrder", {
		money_suborder: {type: DataTypes.DECIMAL(6,2)},
		percentage_score: {type: DataTypes.DECIMAL(3,1)},
		money_score: {type: DataTypes.DECIMAL(6,2)},
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				SubOrder.belongsTo(models.Order);
			}
		}
	});
	return SubOrder;
};