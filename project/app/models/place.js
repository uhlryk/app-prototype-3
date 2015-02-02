/*jslint node: true */
"use strict";
/**
 * Są to dane pojedyńczej placówki danego partnera. Zwykle partner będzie miał jeden
 * punkt, ale mogą się zdarzyć z większą ilością. Konto partnera może przynależeć do wielu
 * placówek, może samo mieć też wiele placówek. Nagrody i płatności idą do placówek
 */
module.exports = function(sequelize, DataTypes) {
	var Place = sequelize.define("Place", {
		name: {type: DataTypes.STRING(50), allowNull: false}
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Place.belongsToMany(models.PartnerAccount, {through: 'PlacePartnerAccount'});
				Place.belongsTo(models.Partner);
			}
		}
	});
	return Place;
};