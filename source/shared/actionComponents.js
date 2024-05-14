const { CombatantReference, Adventure, Combatant } = require("../classes");

/** Selects all allies of the user (including themself)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectAllAllies(self, adventure) {
	if (self.team === "delver") {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
	} else {
		const liveTargets = [];
		adventure.room.enemies.forEach((enemy, index) => {
			if (enemy.hp > 0) {
				liveTargets.push(new CombatantReference("enemy", index))
			}
		});
		return liveTargets;
	}
}

/** Selects all allies of the user (including themself)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectAllOtherAllies(self, adventure) {
	const selfIndex = adventure.getCombatantIndex(self);
	if (self.team === "delver") {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index)).filter((ref => ref.index !== selfIndex));
	} else {
		const liveTargets = [];
		adventure.room.enemies.forEach((enemy, index) => {
			if (enemy.hp > 0 && index !== selfIndex) {
				liveTargets.push(new CombatantReference("enemy", index))
			}
		});
		return liveTargets;
	}
}

/** Selects a random ally to the user (exlcluding self)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectRandomOtherAlly(self, adventure) {
	const selfIndex = adventure.getCombatantIndex(self);
	const otherLivingAllyIndicies = [];
	const combatantPool = self.team === "delver" ? adventure.delvers : adventure.room.enemies;
	combatantPool.forEach((combatant, index) => {
		if (combatant.hp > 0 && index !== selfIndex) {
			otherLivingAllyIndicies.push(index);
		}
	})
	if (selfIndex === -1 || otherLivingAllyIndicies.length === 0) {
		return [];
	}
	const index = otherLivingAllyIndicies[adventure.generateRandomNumber(otherLivingAllyIndicies.length, "battle")];
	return [new CombatantReference(self.team, index)];
}

/** Selects all foes of the user
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectAllFoes(self, adventure) {
	if (self.team === "delver") {
		const liveTargets = [];
		adventure.room.enemies.forEach((enemy, index) => {
			if (enemy.hp > 0) {
				liveTargets.push(new CombatantReference("enemy", index))
			}
		});
		return liveTargets;
	} else {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
	}
}

/** Selects a random foe
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectRandomFoe(self, adventure) {
	if (self.team === "delver") {
		return [new CombatantReference("enemy", adventure.generateRandomNumber(adventure.room.enemies.length, "battle"))];
	} else {
		return [new CombatantReference("delver", adventure.generateRandomNumber(adventure.delvers.length, "battle"))];
	}
}

/** Selects all combatants (delvers + enemies)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectAllCombatants(self, adventure) {
	return selectAllAllies(self, adventure).concat(selectAllFoes(self, adventure));
}

/** Selects all combatants except self (delvers + enemies)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectAllOtherCombatants(self, adventure) {
	return selectAllOtherAllies(self, adventure).concat(selectAllFoes(self, adventure));
}


/** Selects the user
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectSelf(self, adventure) {
	return [new CombatantReference(self.team, adventure.getCombatantIndex(self))];
}

/** For moves the primarily affect combat state instead of combatants
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectNone(self, adventure) {
	return [];
}

/** @param {string} actionName */
function nextRepeat(actionName) {
	return actionName;
}

/** @param {string} actionName */
function nextRandom(actionName) {
	return "random";
}

module.exports = {
	selectAllAllies,
	selectAllOtherAllies,
	selectRandomOtherAlly,
	selectAllFoes,
	selectRandomFoe,
	selectAllCombatants,
	selectAllOtherCombatants,
	selectSelf,
	selectNone,
	nextRepeat,
	nextRandom
};
