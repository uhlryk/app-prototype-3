// TO DO !!!
/*jslint node: true */
"use strict";
/**
 * Zawiera powiązanie miedzy partnerem a produktem. Dany produkt może mieć wielu partnerów - zwłaszcza account. Każdy z partnerów możem ieć wiele produktów, stąd relacja wiele do wielu
 * Dodatkowo mamy tu powiązanie z lokalizacją, które mówi na jakim obszarze dana usługa jest dostępna u danego partnera Partner ma również lokacje, ale dana usługa nie musi pokrywać się z
 * lokacjami partnera.
 */
module.exports = function(sequelize, DataTypes) {
	var ProductPlace = sequelize.define("ProductPlace", {
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				ProductPlace.belongsTo(models.Product);
				ProductPlace.belongsTo(models.Place);
			}
		}
	});
	return ProductPlace;
};