/*jslint node: true */
"use strict";
/**
 * Przechowuje pojedynczą kartę, karty są generowane przez admina jako pakiet wielu kart, są one domyślnie nieaktywne,
 * gdy user zakłada konto to zostaje mu przypisana pierwsza wolna karta.
 * Każda karta ma numer EAN13. Składa się 13 cyfr, gdzie ostatnia jest cufrą kontrolną, admin dostaje do dyspozycji określoną końcową liczbę cyfr np 4 ostatnie cyfry.
 * Pozostałe cyfry są stałe. Generując pakiet iterujemy po cyfrach które mamy do dyspozycji
 *
 * Na karcie musi być pole hasło, w przeciwnym razie można przejąć komuś kartę, podając EAN
 */
module.exports = function(sequelize, DataTypes) {
	var Card = sequelize.define("Card", {
		ean_code: {type: DataTypes.INTEGER, unique: true, allowNull: false},
		code: {type: DataTypes.STRING(5), unique: true, allowNull: false},
		status: {type: DataTypes.ENUM('inactive', 'active', 'disable'), defaultValue:'inactive', allowNull: false},
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				Card.belongsToMany(models.CustomerAccount, {through: 'CardCustomerAccount'});
				Card.hasMany(models.Order);
				Card.hasMany(models.Score);
			}
		}
	});
	return Card;
};