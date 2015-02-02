/*jslint node: true */
"use strict";
/**
 * Jest to zgrupowanie kart utworzonych przez admina jako pakiet.
 * karta może być wirtualna lub rzeczywista. Na obecnym etapie mamy założenie
 * że przy tworzeniu pakietu kart admin określa czy jest ona rzeczywista czy wirtualna
 * wartość ma tylko takie znaczenie, że gdy jest rzeczywista to musi być wysłana klientowi
 *
 */
module.exports = function(sequelize, DataTypes) {
	var CardBundle = sequelize.define("CardBundle", {
		beginEAN : {type: DataTypes.BIGINT(12)},
		type: {type: DataTypes.ENUM('real', 'virtual'), defaultValue:'virtual', allowNull: false},
		endEAN : {type: DataTypes.BIGINT(12)}
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				CardBundle.hasMany(models.Card);
			}
		}
	});
	return CardBundle;
};