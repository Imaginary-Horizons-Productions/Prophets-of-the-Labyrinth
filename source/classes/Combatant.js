const { SURPASSING_VALUE } = require("../constants");

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
	level = 1;
	maxHP = 300;
	power = 0;
	speed = 100;
	critRate = 20;
	poise = 6;

	hp = 300;
	protection = 0;
	stagger = 0;
	isStunned = false;
	crit = false;
	roundSpeed = 0;
	/** @type {{[modifierName: string]: number}} */
	modifiers = {};
	/** @type {Record<string, number[]>} */
	roundRns = {};

	/** @returns {number} */
	getMaxHP() { throw new Error(`getMaxHP not implemented in child class ${this.constructor.name}`) }

	/** @returns {number} */
	getPower() { throw new Error(`getPower not implemented in child class ${this.constructor.name}`) }

	/**
	 * @param {boolean} includeRoundSpeed
	 * @returns {number}
	 */
	getSpeed(includeRoundSpeed) { throw new Error(`getSpeed not implemented in child class ${this.constructor.name}`) }

	/** @returns {number} */
	getCritRate() { throw new Error(`getCritRate not implemented in child class ${this.constructor.name}`) }

	/** @returns {number} */
	getPoise() { throw new Error(`getPoise not implemented in child class ${this.constructor.name}`) }

	/** Get the number of stacks of the given modifier the combatant has
	 * @param {string} modifierName
	 */
	getModifierStacks(modifierName) {
		return this.modifiers[modifierName] ?? 0
	}

	/** @returns {number} */
	getDamageCap() { throw new Error(`getDamageCap not implemented in child class ${this.constructor.name}`) }
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
		this.power = 35;
	}
	isReady = false;
	/** @type {Gear[]} */
	gear = [];
	pet = {
		type: "",
		level: 0
	};
	startingArtifact = "";

	getMaxHP() {
		return Math.floor(this.maxHP) + this.gear.reduce((totalGearMaxHP, gear) => {
			if (parseInt(gear.maxHP)) {
				return totalGearMaxHP + gear.maxHP;
			} else {
				return totalGearMaxHP;
			}
		}, 0);
	}

	getPower() {
		return Math.floor(this.power + this.getModifierStacks("Power Up") - this.getModifierStacks("Power Down") + this.gear.reduce((totalPower, gear) => {
			if (parseInt(gear.power)) {
				return totalPower + gear.power;
			} else {
				return totalPower;
			}
		}, 0));
	}

	/** @param {boolean} includeRoundSpeed */
	getSpeed(includeRoundSpeed) {
		const gearSpeed = this.gear.reduce((totalGearSpeed, gear) => {
			if (parseInt(gear.speed)) {
				return totalGearSpeed + gear.speed;
			} else {
				return totalGearSpeed;
			}
		}, 0);
		let totalSpeed = this.speed + gearSpeed;
		if (includeRoundSpeed) {
			totalSpeed += this.roundSpeed;
		}
		if ("Slow" in this.modifiers) {
			const slowStacks = this.getModifierStacks("Slow");
			totalSpeed -= slowStacks * 5;
		}
		if ("Quicken" in this.modifiers) {
			const quickenStacks = this.getModifierStacks("Quicken");
			totalSpeed += quickenStacks * 5;
		}
		return Math.floor(totalSpeed);
	}

	getCritRate() {
		return Math.floor(this.critRate + this.gear.reduce((totalCritRate, gear) => {
			if (parseInt(gear.critRate)) {
				return totalCritRate + gear.critRate;
			} else {
				return totalCritRate;
			}
		}, 0));
	}

	getPoise() {
		return Math.floor(this.poise + this.gear.reduce((totalGearPoise, gear) => {
			if (parseInt(gear.poise)) {
				return totalGearPoise + gear.poise;
			} else {
				return totalGearPoise;
			}
		}, 0));
	}

	getDamageCap() {
		const capBoostFromGear = SURPASSING_VALUE * this.gear.reduce((surpassingCount, gear) => gear.name.startsWith("Surpassing") ? surpassingCount + 1 : surpassingCount, 0);
		return 450 + (this.level * 50) + this.getModifierStacks("Power Up") + capBoostFromGear;
	}
}

class Gear {
	/**
	 * @param {string} nameInput
	 * @param {number} chargesInput
	 * @param {number} maxHPInput
	 * @param {number} powerInput
	 * @param {number} speedInput
	 * @param {number} critRateInput
	 * @param {number} poiseInput
	 */
	constructor(nameInput, chargesInput, maxHPInput, powerInput, speedInput, critRateInput, poiseInput) {
		this.name = nameInput;
		this.charges = chargesInput;
		this.maxHP = maxHPInput;
		this.power = powerInput;
		this.speed = speedInput;
		this.critRate = critRateInput;
		this.poise = poiseInput;
	}
	cooldown = 0;
};

module.exports = {
	Combatant,
	Delver,
	Gear
};
