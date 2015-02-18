/*jslint node: true */
"use strict";
/**
 * Właściwe konto klienta, który może mieć wiele kont customer_account. Na tym poziomie nie ma adresu email. Jest on weryfikowany na poziomie account.
 * Pole is_mail_address oznacza sprawdzenie czy dane konta są te same co dane korespondencyjne.
 * Nie blokujemy nipu by był unikalny, na wypadek gdyby jakaś firma zakładała wiele konto
 */
module.exports = function(sequelize, DataTypes) {
	var Customer = sequelize.define("Customer", {
		status: {type: DataTypes.ENUM('inactive', 'active', 'disable'), defaultValue:'inactive'},
		firmname: DataTypes.STRING(255),
		nip : {type: DataTypes.STRING(15), unique:false},
		street_address: DataTypes.STRING(255),
		house_address: DataTypes.STRING(10),
		flat_address: DataTypes.STRING(10),
		zipcode_address: DataTypes.STRING(10),
		city_address: DataTypes.STRING(45),
		is_mail_address: {type:DataTypes.ENUM('yes','no'), defaultValue:'yes'},//czy adres korespondencyjny jest taki sam
		name_mail: DataTypes.STRING(255),
		street_mail: DataTypes.STRING(255),
		house_mail: DataTypes.STRING(10),
		flat_mail: DataTypes.STRING(10),
		zipcode_mail: DataTypes.STRING(10),
		city_mail: DataTypes.STRING(45),
		firstname: DataTypes.STRING(45),
		lastname: DataTypes.STRING(45),
		phone: DataTypes.STRING(15)
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Customer.hasMany(models.CustomerAccount);
				Customer.hasMany(models.Card);
			}
		}
	});
	return Customer;
};