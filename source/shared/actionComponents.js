const { CombatantReference, Adventure, Combatant } = require("../classes");

/** Wraps standardized move effect in validation for living targets
 * @param {(targets: Combatant[], user: Combatant, isCrit: boolean, adventure: Adventure) => Promise<string>} next
 */
function needsLivingTargets(next) {
	return (targets, user, isCrit, adventure) => {
		const livingTargets = [];
		const deadTargets = [];
		for (const target of targets) {
			if (target.hp > 0) {
				livingTargets.push(target);
			} else {
				deadTargets.push(target);
			}
		}
		if (livingTargets.length > 0) {
			const deadTargetText = "";
			if (deadTargets.length > 0) {
				deadTargetText += ` ${deadTargets.map(target => target.getName(adventure.room.enemyIdMap)).join(", ")} ${deadTargets === 1 ? "was" : "were"} already dead!`
			}
			return `${next(livingTargets, user, isCrit, adventure)}${deadTargetText}`;
		} else if (targets.length === 1) {
			return ` But ${targets[0].getName(adventure.room.enemyIdMap)} was already dead!`;
		} else {
			return ` But all targets were already dead!`;
		}
	}
}

/** Selects all allies of the user (including themself)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectAllAllies(self, adventure) {
	if (self.team === "delver") {
		return adventure.delvers.map((delver, index) => new CombatantReference("delver", index));
	} else {
		return adventure.room.enemies.map((enemy, index) => new CombatantReference("enemy", index));
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
		return [new CombatantReference("none", -1)];
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
		return adventure.room.enemies.map((enemy, index) => new CombatantReference("enemy", index));
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
	return [new CombatantReference("none", -1)];
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
	needsLivingTargets,
	selectAllAllies,
	selectRandomOtherAlly,
	selectAllFoes,
	selectRandomFoe,
	selectSelf,
	selectNone,
	nextRepeat,
	nextRandom
};
