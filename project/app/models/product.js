// TO DO !!!
/*jslint node: true */
"use strict";
/**
 * Zawiera usługę lub produkt jaki można wymienić za punkty. Mogą być różne wersje produktów. Produkty fizyczne dostarczane przez admina i produkty dostarczane przez partnera mające zasięg
 * na całą polskę, ale też mogą być usługi na danym obszarze
 */
module.exports = function(sequelize, DataTypes) {
	var Product = sequelize.define("Product", {
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Product.hasMany(models.ProductScore);
				Product.hasMany(models.ProductPlace);
			}
		}
	});
	return Product;
};