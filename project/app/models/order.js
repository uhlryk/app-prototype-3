/*jslint node: true */
"use strict";
/**
 * Zawiera realizacje zamówień customera u partnera. zamówienie może być rozbite na dowolnie dużu suborderów gdzie każdy ma inną część kwoty i inny przelicznik
 * W przypadku braku rozbicia to order ma jeden suborder. Jest to głównie tablica informacyna bo do obliczania kwot partnera służy payment powiązana z sub_order
 * a do obliczania punktów customera służy score powiązane z sub_order.
 * Najprawdopodobniej nie będzie używane powiązanie, CustomerAccount, będziemy wiązać tylko z kartą.
 * order_code to numer dokumentu w formie jakiejś czytelnej np iiii/xxxx/2015 gdzie i to kolejne numery a xxxx to kod
 * money_order to całkowita kwota zamówienia netto
 * order_document realny dokument typu faktura czy rachunek
 * date_use - partner rozlicza się wg daty dodania dokumentu, a ta data jest przez niego ustalana +- 5 dni zakresu, ta data pojawi się u customera
 * money_score - podsumowana kwota wynikająca z częściowych kwot suborder dotyczących kosztu wygenerowania dla klienta punktów, każdy suborder może mieć inne oprocentowanie
 * percentage_app - oprocentowanie z którego obliczamy koszt na aplikację, jest on określony na Partnera, ale w teorii może się wachać więc jest oznaczony w danym zamówieniu
 * money_app - obliczony koszt na aplikację, kwota jest stała dla wszystkich suborderów
 */
module.exports = function(sequelize, DataTypes) {
	var Order = sequelize.define("Order", {
		order_code: {type: DataTypes.STRING(20)},
		money_order: {type: DataTypes.DECIMAL(6,2)},
		order_document: {type: DataTypes.STRING(20)},
		date_use: {type: DataTypes.DATE},
		money_score: {type: DataTypes.DECIMAL(6,2)},
		percentage_app: {type: DataTypes.DECIMAL(3,1)},
		money_app: {type: DataTypes.DECIMAL(6,2)},
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Order.belongsTo(models.Card);
				Order.belongsTo(models.CustomerAccount);
				Order.belongsTo(models.PartnerAccount);
				Order.belongsTo(models.Score);
				Order.hasMany(models.Payment);
				Order.hasMany(models.SubOrder);
			}
		}
	});
	return Order;
};