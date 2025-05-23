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

/** Selects a random ally to the user (including self)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectRandomAlly(self, adventure) {
	const allyIndicies = [];
	const combatantPool = self.team === "delver" ? adventure.delvers : adventure.room.enemies;
	combatantPool.forEach((combatant, index) => {
		if (combatant.hp > 0) {
			allyIndicies.push(index);
		}
	})
	const index = allyIndicies[adventure.generateRandomNumber(allyIndicies.length, "battle")];
	return [new CombatantReference(self.team, index)];
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

/** Selects the user and a random ally to the user (exlcluding self)
 * @param {Combatant} self
 * @param {Adventure} adventure
 */
function selectSelfAndRandomOtherAlly(self, adventure) {
	const selfIndex = adventure.getCombatantIndex(self);
	const targetReferences = [new CombatantReference(self.team, selfIndex)];
	const otherLivingAllyIndicies = [];
	const combatantPool = self.team === "delver" ? adventure.delvers : adventure.room.enemies;
	combatantPool.forEach((combatant, index) => {
		if (combatant.hp > 0 && index !== selfIndex) {
			otherLivingAllyIndicies.push(index);
		}
	})
	if (otherLivingAllyIndicies.length > 0) {
		const index = otherLivingAllyIndicies[adventure.generateRandomNumber(otherLivingAllyIndicies.length, "battle")];
		targetReferences.push(new CombatantReference(self.team, index));
	}
	return targetReferences;
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
		const livingEnemyIndicies = [];
		for (let i = 0; i < adventure.room.enemies.length; i++) {
			if (adventure.room.enemies[i].hp > 0) {
				livingEnemyIndicies.push(i);
			}
		}
		// If there are no living enemies, combat should already be over
		return [new CombatantReference("enemy", livingEnemyIndicies[adventure.generateRandomNumber(livingEnemyIndicies.length, "battle")])];
	} else {
		return [new CombatantReference("delver", adventure.generateRandomNumber(adventure.delvers.length, "battle"))];
	}
}

/** Selects multiple random foes
 * @param {number} count
 */
function selectMultipleRandomFoes(count) {
	/**
	 * @param {Combatant} self
	 * @param {Adventure} adventure
	 */
	return (self, adventure) => {
		const targetReferences = [];
		if (self.team === "delver") {
			const livingEnemyIndicies = [];
			for (let i = 0; i < adventure.room.enemies.length; i++) {
				if (adventure.room.enemies[i].hp > 0) {
					livingEnemyIndicies.push(i);
				}
			}
			for (let i = 0; i < count; i++) {
				// If there are no living enemies, combat should already be over
				targetReferences.push(new CombatantReference("enemy", livingEnemyIndicies[adventure.generateRandomNumber(livingEnemyIndicies.length, "battle")]));
			}
		} else {
			for (let i = 0; i < count; i++) {
				targetReferences.push(new CombatantReference("delver", adventure.generateRandomNumber(adventure.delvers.length, "battle")));
			}
		}
		return targetReferences;
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

module.exports = {
	selectAllAllies,
	selectAllOtherAllies,
	selectRandomAlly,
	selectRandomOtherAlly,
	selectSelfAndRandomOtherAlly,
	selectAllFoes,
	selectRandomFoe,
	selectMultipleRandomFoes,
	selectAllCombatants,
	selectAllOtherCombatants,
	selectSelf,
	selectNone
};
