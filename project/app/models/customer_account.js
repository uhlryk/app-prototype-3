/*jslint node: true */
"use strict";
/**
 * Dana firma ma konto Customer, ale dany customer może mieć wiele kont, gdzie jedno jest określane jako główne 'parent' a pozostałe są 'child'
 * Zakładając konto Customer od razu ma zakładane konto 'parent'. Konta domyślnie są aktywne, konto główne może deaktywować lub usuwać konta 'child'
 * Jeśli robimy walidację emaili to przy zakładaniu konta wpisujemy email_validation a email zostawiamy puste, dopiero po zwalidowaniu email jest wypełniane to pole.
 * Zabezpiecza to nas w sytuacji gdy ktoś użyje cudzego emaila i przez to zablokuje mu możliwość założenia konta
 * Hasło sha1
 */
module.exports = function(sequelize, DataTypes) {
	var CustomerAccount = sequelize.define("CustomerAccount", {
		type: {type: DataTypes.ENUM('parent', 'child'), defaultValue: 'parent', allowNull: false},
		status: {type: DataTypes.ENUM('inactive', 'active', 'disable', 'delete'), defaultValue:'active', allowNull: false},
		email: {type: DataTypes.STRING(45), unique: true, allowNull: true},
		email_validation: {type: DataTypes.STRING(45), unique: false, allowNull: true},
		password: {type: DataTypes.STRING(45), allowNull: true},
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				CustomerAccount.belongsToMany(models.Card, {through: 'CardCustomerAccount'});
				CustomerAccount.belongsTo(models.Customer);
				CustomerAccount.hasMany(models.Order);
			}
		}
	});
	return CustomerAccount;
};