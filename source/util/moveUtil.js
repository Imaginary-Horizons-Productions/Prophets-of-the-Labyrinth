const { CombatantReference, Adventure } = require("../classes");

/** Selects all allies of the user (including themself)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
module.exports.selectAllAllies = function (self, adventure) {
	if (self.team === "delver") {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
	} else {
		return adventure.room.enemies.map((enemy, index) => new CombatantReference("enemy", index));
	}
}

/** Selects all foes of the user
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
module.exports.selectAllFoes = function (self, adventure) {
	if (self.team === "delver") {
		return adventure.room.enemies.map((enemy, index) => new CombatantReference("enemy", index));
	} else {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
	}
}

/** Selects the user
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
module.exports.selectSelf = function (self, adventure) {
	return [new CombatantReference(self.team, self.findMyIndex(adventure))];
}
