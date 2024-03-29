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
		type: {
			type: DataTypes.ENUM('parent', 'child'),
			defaultValue: 'parent',
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM('inactive', 'active', 'disable', 'delete'),
			defaultValue:'active',
			allowNull: false
		},
		email: {
			//docelowo to pole jest puste i tworzenia konta wypełnia pole email_validation
			//user jeśli aktywuje konto, wtedy z pola email_validation jest przepisanie na email
			type: DataTypes.STRING(45),
			unique: true,
			allowNull: true,
			validate : {
				isEmail : true,
			}
		},
		email_validation: {
			type: DataTypes.STRING(45),
			unique: false,
			allowNull: true,
			validate : {
				isEmail : true,
			}
		},
		password: {
			type: DataTypes.STRING(60),
			allowNull: true,
		},
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				CustomerAccount.belongsToMany(models.Card, {through: 'CardCustomerAccounts'});
				CustomerAccount.belongsTo(models.Customer);
				CustomerAccount.hasMany(models.Order);
			}
		}
	});
	return CustomerAccount;
};