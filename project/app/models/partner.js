/*jslint node: true */
"use strict";
/**
 * Konto podstawowe firmy. Nip nie jest unikalny by można było założyć wiele kont (stacje paliw mają np jeden nip)
 */
module.exports = function(sequelize, DataTypes) {
	var Partner = sequelize.define("Partner", {
		status: {type: DataTypes.ENUM('inactive', 'active', 'disable'), defaultValue:'inactive'},
		firmname: DataTypes.STRING(255),
		nip : {type: DataTypes.STRING(15), unique:false},
		street_address: DataTypes.STRING(255),
		house_address: DataTypes.STRING(10),
		flat_address: DataTypes.STRING(10),
		zipcode_address: DataTypes.STRING(10),
		city_address: DataTypes.STRING(45),
		is_mail_address: {type:DataTypes.ENUM('yes','no'), defaultValue:'yes'},
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
		underscored: true,
		classMethods: {
			associate: function(models) {
				Partner.hasMany(models.PartnerAccount);
			}
		}
	});
	return Partner;
};