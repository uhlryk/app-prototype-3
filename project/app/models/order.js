/*jslint node: true */
"use strict";
/**
 * Zawiera realizacje zamówień customera u partnera. zamówienie może być rozbite na dowolnie dużu suborderów gdzie każdy ma inną część kwoty i inny przelicznik
 * W przypadku braku rozbicia to order ma jeden suborder. Jest to głównie tablica informacyna bo do obliczania kwot partnera służy payment powiązana z sub_order
 * a do obliczania punktów customera służy score powiązane z sub_order
 */
module.exports = function(sequelize, DataTypes) {
	var Order = sequelize.define("Order", {
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				Order.belongsTo(models.Card);
				Order.belongsTo(models.CustomerAccount);
				Order.belongsTo(models.Partner);
				Order.hasMany(models.SubOrder);
			}
		}
	});
	return Order;
};