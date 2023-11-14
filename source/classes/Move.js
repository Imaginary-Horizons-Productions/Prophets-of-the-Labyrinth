const { Combatant } = require("./Combatant");

class Move {
	/**
	 * @param {CombatantReference} userReferenceInput
	 * @param {"gear" | "item" | "action"} typeInput
	 * @param {boolean} isCritInput
	 */
	constructor(userReferenceInput, typeInput, isCritInput) {
		this.userReference = userReferenceInput;
		this.type = typeInput;
		this.isCrit = isCritInput;
	}
	/** @type {string} */
	name = null;
	priority = 0;
	speed = 0;
	randomOrder = 0;
	/** @type {CombatantReference[]} */
	targets = [];

	/** compare function for sorting Moves to descending speed
	 * @param {Move} first
	 * @param {Move} second
	 * @returns positive if second before first, negative if first before second
	 */
	static compareMoveSpeed(first, second) {
		if (second.priority === first.priority) {
			if (second.speed === first.speed) {
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

	/** @param {Combatant} combatant */
	setSpeedByCombatant(combatant) {
		this.speed = combatant.getSpeed();
		return this;
	}

	/** @param {number} integer */
	setSpeedByValue(integer) {
		this.speed = integer;
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
