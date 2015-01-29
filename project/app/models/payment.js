/*jslint node: true */
"use strict";
/**
 * Zawiera wszystkie płatności dla partnera, zarówno wpłacone jak te które musi wypłacić
 */
module.exports = function(sequelize, DataTypes) {
	var Payment = sequelize.define("Payment", {
		money: {type: DataTypes.DECIMAL(6,2)},
		type: {type: DataTypes.ENUM('bonus', 'order'), defaultValue: 'bonus', allowNull: false},
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Payment.hasOne(models.Order);
				Payment.belongsTo(models.Partner);
			}
		}
	});
	return Payment;
};