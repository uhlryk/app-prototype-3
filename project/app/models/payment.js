/*jslint node: true */
"use strict";
/**
 * Zawiera wszystkie płatności dla partnera, zarówno wpłacone jak te które musi wypłacić
 * wartość z plusem to nadwyżka partnera, z minusem to kwota ją winien jest dla aplikacji,
 * date_parent data wg której rozliczamy za to partnera, czyli w jakim okresie rozrachunkowym znajduje się
 *  ta platność
 */
module.exports = function(sequelize, DataTypes) {
	var Payment = sequelize.define("Payment", {
		money: {type: DataTypes.DECIMAL(6,2)},
		type: {type: DataTypes.ENUM('package','fee', 'order_app', 'order_score : '), defaultValue: 'package', allowNull: false},
		title : {type : DataTypes.STRING(50), allowNull : true},
		date_use: {type: DataTypes.DATE},
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Payment.belongsTo(models.Order);
				Payment.belongsTo(models.Partner);
				Payment.belongsTo(models.PartnerAccount);
				Payment.belongsTo(models.Place);
			}
		}
	});
	return Payment;
};