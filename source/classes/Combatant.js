class Combatant {
	/**
	 * @param {string} nameInput
	 * @param {"delver" | "enemy"} teamInput
	 */
	constructor(nameInput, teamInput) {
		this.name = nameInput;
		this.team = teamInput;
	}
	/** @type {string} Discord user id for delvers; uniquifying number for enemies */
	id;
	/** @type {string} archetype for delvers; lookup name for enemies */
	archetype;
	/** @type {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} */
	element;
	maxHP = 300;
	speed = 100;
	critRate = 0;
	poise = 6;

	hp = 300;
	block = 0;
	stagger = 0;
	isStunned = false;
	crit = false;
	roundSpeed = 0;
	/** @type {{[modifierName: string]: number}} */
	modifiers = {};

	/**
	 * @param {{[enemyName: string]: number}} enemyIdMap
	 * @returns {string}
	 */
	getName(enemyIdMap) { }

	/** @returns {number} */
	getMaxHP() { }

	/** @returns {number} */
	getSpeed() {
		let gearSpeed = 0;
		if ("gear" in this) {
			gearSpeed = this.gear.reduce((totalGearSpeed, gear) => {
				if (parseInt(gear.speed)) {
					return totalGearSpeed + gear.speed;
				} else {
					return totalGearSpeed;
				}
			}, 0);
		}
		let totalSpeed = this.speed + this.roundSpeed + gearSpeed;
		if ("Slow" in this.modifiers) {
			const slowStacks = this.getModifierStacks("Slow");
			totalSpeed -= slowStacks * 5;
		}
		if ("Quicken" in this.modifiers) {
			const quickenStacks = this.getModifierStacks("Quicken");
			totalSpeed += quickenStacks * 5;
		}
		return Math.ceil(totalSpeed);
	}

	/** @returns {number} */
	getCritRate() { }

	/** @returns {number} */
	getPoise() { }

	/** Get the number of stacks of the given modifier the combatant has
	 * @param {string} modifierName
	 */
	getModifierStacks(modifierName) {
		return this.modifiers[modifierName] ?? 0
	}

	/** add Stagger, negative values allowed
	 * @param {number | "elementMatchAlly" | "elementMatchFoe"} value
	 */
	addStagger(value) {
		if (!this.isStunned) {
			let pendingStagger = value;
			if (value === "elementMatchAlly") {
				pendingStagger = -1;
			} else if (value === "elementMatchFoe") {
				pendingStagger = 2;
			}
			this.stagger = Math.min(Math.max(this.stagger + pendingStagger, 0), this.getPoise());
		}
	}
}

class Delver extends Combatant {
	/** Represents a player's information specific to a specific delve including: delve id, stats, gear and upgrades, and artifacts
	 * @param {string} idInput the player's Discord id
	 * @param {string} nameInput
	 * @param {string} adventureIdInput
	 */
	constructor(idInput, nameInput, adventureIdInput) {
		super(nameInput, "delver");
		this.id = idInput;
		this.adventureId = adventureIdInput;
	}
	isReady = false;
	/** @type {Gear[]} */
	gear = [];
	startingArtifact = "";

	/** @param {{[enemyName: string]: number}} enemyIdMap */
	getName(enemyIdMap) {
		return this.name;
	}

	getMaxHP() {
		return this.maxHP + this.gear.reduce((totalGearMaxHP, gear) => {
			if (parseInt(gear.maxHP)) {
				return totalGearMaxHP + gear.maxHP;
			} else {
				return totalGearMaxHP;
			}
		}, 0);
	}

	getCritRate() {
		return this.critRate + this.gear.reduce((totalCritRate, gear) => {
			if (parseInt(gear.critRate)) {
				return totalCritRate + gear.critRate;
			} else {
				return totalCritRate;
			}
		}, 0);
	}

	getPoise() {
		return this.poise + this.gear.reduce((totalGearPoise, gear) => {
			if (parseInt(gear.poise)) {
				return totalGearPoise + gear.poise;
			} else {
				return totalGearPoise;
			}
		}, 0);
	}
}

class Gear {
	/**
	 * @param {string} nameInput
	 * @param {number} durabilityInput
	 * @param {number} maxHPInput
	 * @param {number} speedInput
	 * @param {number} critRateInput
	 * @param {number} poiseInput
	 */
	constructor(nameInput, durabilityInput, maxHPInput, speedInput, critRateInput, poiseInput) {
		this.name = nameInput;
		this.durability = durabilityInput;
		this.maxHP = maxHPInput;
		this.speed = speedInput;
		this.critRate = critRateInput;
		this.poise = poiseInput;
	}
};

module.exports = {
	Combatant,
	Delver,
	Gear
};
