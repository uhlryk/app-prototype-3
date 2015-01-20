/*jslint node: true */
"use strict";
/**
 * Zawiera wszystkie płatności dla partnera, zarówno wpłacone jak te które musi wypłacić
 */
module.exports = function(sequelize, DataTypes) {
	var Payment = sequelize.define("Payment", {
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				Payment.hasOne(models.SubOrder);
				Payment.belongsTo(models.Partner);
			}
		}
	});
	return Payment;
};