/*jslint node: true */
"use strict";
/**
 * Domyślnie konto formowe ma jedno konto account, ale może w przyszłości się to zmieni stąd są to dwa różne modele. Czyli zakładając Partner zakłada się jedno PartnerAccount
 * typu 'parent' i na tą chwilę nie dajemy możliwości zakładać innych 'child'. Podobnie jak w Customer przy zakłądaniu konta wypełniamy email_validation tylko. I dopiero
 * po zwalidowaniu konta wpisujemy 'email'.
 * Jak dodamy opcje lokalizacji partnerów to mozemy użyć tego by wskazać różne punkty, realizacji usługi czy dokonanych zamówień.
 * Różne konta partnerów mogą mieć różne usługi udostępnione, na dodatek w różnych regionach
 */
module.exports = function(sequelize, DataTypes) {
	var PartnerAccount = sequelize.define("PartnerAccount", {
		type: {type: DataTypes.ENUM('parent', 'child'), defaultValue: 'parent', allowNull: false},
		status: {type: DataTypes.ENUM('inactive', 'active', 'disable', 'delete'), defaultValue:'active', allowNull: false},
		email: {type: DataTypes.STRING(45), unique: true, allowNull: true},
		email_validation: {type: DataTypes.STRING(45), unique: false, allowNull: true},
		password: DataTypes.STRING(60)
	}, {
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: function(models) {
				PartnerAccount.belongsTo(models.Partner);
				PartnerAccount.hasMany(models.ProductPartner);
			}
		}
	});
	return PartnerAccount;
};