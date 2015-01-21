/**
 * Motody tworzenia konta (account zawiera normalnie tworzenie kont partnera i customera, ale dla partnera uprawnienie to admin)
 */
module.exports = function(req, res, next) {
	res.sendStatus(403);
};
