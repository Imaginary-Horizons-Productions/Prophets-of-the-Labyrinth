const { Combatant } = require("./Combatant");

class Move {
	/**
	 * @param {CombatantReference} userReference
	 * @param {"gear" | "item" | "action"} typeInput
	 * @param {boolean} isCritInput
	 */
	constructor(userReference, typeInput, isCritInput, speedInput) {
		this.type = typeInput;
		this.speed = speedInput;
		this.isCrit = isCritInput;
		this.userReference = userReference;
	}
	/** @type {string} */
	name = null;
	priority = 0;
	randomOrder = 0;
	/** @type {CombatantReference[]} */
	targets = [];

	/** compare function for sorting Moves to descending speed
	 * @param {Move} first
	 * @param {Move} second
	 * @returns positive if second before first, negative if first before second
	 */
	static compareMoveSpeed(first, second) {
		if (second.priority == first.priority) {
			if (second.speed == first.speed) {
				return second.randomOrder - first.randomOrder;
			} else {
				return second.speed - first.speed;
			}
		} else {
			return second.priority - first.priority;
		}
	}

	/** @param {string} moveName */
	setName(moveName) {
		this.name = moveName;
		return this;
	}

	/** @param {Combatant} combatant */
	setSpeed(combatant) {
		// DESIGN SPACE: if enemy.archetype has static speed, or is always faster than a delver, etc, put that logic here
		this.speed = combatant.getTotalSpeed();
		return this;
	}

	/** @param {number} number */
	setPriority(number) {
		this.priority = number;
		return this;
	}

	/** @param {CombatantReference} reference */
	addTarget(reference) {
		this.targets.push(reference);
		return this;
	}
};

class CombatantReference {
	/**
	 * @param {"delver" | "enemy" | "none"} teamInput
	 * @param {number} indexInput
	*/
	constructor(teamInput, indexInput) {
		this.team = teamInput;
		this.index = indexInput;
	}
};

module.exports = {
	Move,
	CombatantReference
}
