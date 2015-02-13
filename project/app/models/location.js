/*jslint node: true */
"use strict";
/**
 * Są to kraj, województwa, powiaty i gminy
 * kraj ma level 0
 * województwo ma level 1
 * powiar level 2
 * gmina level 3
 *
 * partner place może mieć wiele location
 */
module.exports = function(sequelize, DataTypes) {
	var Location = sequelize.define("Location", {
		name: {type: DataTypes.STRING(50), allowNull: false},
		level : DataTypes.INTEGER
	}, {
		paranoid: true,
		classMethods: {
			associate: function(models) {
				Location.hasOne(models.Location);
				Location.belongsToMany(models.Place, {through: 'PlaceLocation'});
			}
		}
	});
	Location.getTree = function() {
		return Location.findAll({
			attributes : ['id', 'name', 'LocationId' , 'level']
		})
		.then(function(locations){
			var provinceList = [];
			var districtList = [];
			locations.forEach(function(location, i){
				var newLocation = {
					id : location.id,
					name : location.name,
					children : []
				};
				if(location.level === 1){
					provinceList.push(newLocation);
				}
				else if(location.level === 2){
					districtList.push(newLocation);
					provinceList.forEach(function(province, i, a){
						if(province.id === location.LocationId){
							province.children.push(newLocation);
							return;
						}
					});
				}
				else if(location.level === 3){
					districtList.forEach(function(district){
						if(district.id === location.LocationId){
							delete newLocation.children;
							district.children.push(newLocation);
							return;
						}
					});
				}
			});
			return provinceList;
		});
	};
	return Location;
};