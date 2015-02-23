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
		firmname: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate : {
			}
		},
		nip : {
			type: DataTypes.STRING(15),
			unique:false,
			allowNull: false,
			validate : {
			}
		},
		street_address: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate : {
			}
		},
		house_address: {
			type: DataTypes.STRING(10),
			allowNull: false,
			validate : {
			}
		},
		flat_address: {
			type: DataTypes.STRING(10),
			validate : {
			}
		},
		zipcode_address: {
			type: DataTypes.STRING(10),
			allowNull: false,
			validate : {
				is: /^[0-9]{2}-[0-9]{3}$/,
			}
		},
		city_address: {
			type: DataTypes.STRING(45),
			allowNull: false,
			validate : {
			}
		},
		is_mail_address: {
			//czy adres korespondencyjny jest taki sam
			type:DataTypes.ENUM('yes','no'),
			defaultValue:'yes',
			allowNull: false
		},
		name_mail: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate : {
			}
		},
		street_mail: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate : {
			}
		},
		house_mail: {
			type: DataTypes.STRING(10),
			allowNull: false,
			validate : {
			}
		},
		flat_mail: {
			type: DataTypes.STRING(10),
			validate : {
			}
		},
		zipcode_mail: {
			type: DataTypes.STRING(10),
			allowNull: false,
			validate : {
				is: /^[0-9]{2}-[0-9]{3}$/,
			}
		},
		city_mail: {
			type: DataTypes.STRING(45),
			allowNull: false,
			validate : {
			}
		},
		firstname: {
			type: DataTypes.STRING(45),
			allowNull: false,
			validate : {
			}
		},
		lastname: {
			type: DataTypes.STRING(45),
			allowNull: false,
			validate : {
			}
		},
		phone: {
			type: DataTypes.STRING(15),
			allowNull: false,
			validate : {
			}
		}
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