/*jslint node: true */
"use strict";
/**
 * Tabela powiązań między Place a Location, zdefionowana osobno ponieważ ma dodatkowe pole określające czy dana lokacja jest w całości przypisana do useran
 * np województwo (nie musimy przypisywać wtedy wszystkich powiatów i gmin)
 */
module.exports = function(sequelize, DataTypes) {
	var PlaceLocation = sequelize.define("PlaceLocation", {
		isAll: {type: DataTypes.BOOLEAN, defaultValue: true}
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				PlaceLocation.belongsTo(models.Location);
				PlaceLocation.belongsTo(models.Place);
			}
		}
	});
	return PlaceLocation;
};