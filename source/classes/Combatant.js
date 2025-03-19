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
	/** @type {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} */
	essence;
	level = 1;
	maxHP = 300;
	power = 0;
	speed = 100;
	critRate = 20;
	staggerCap = 6;

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

	getBonusHP() {
		return Math.max(0, this.getMaxHP() - 300);
	}

	/** @returns {number} */
	getPower() { throw new Error(`getPower not implemented in child class ${this.constructor.name}`) }

	/**
	 * @param {boolean} includeRoundSpeed
	 * @returns {number}
	 */
	getSpeed(includeRoundSpeed) { throw new Error(`getSpeed not implemented in child class ${this.constructor.name}`) }

	getBonusSpeed() {
		return Math.max(0, this.getSpeed(true) - 100);
	}

	/** @returns {number} */
	getCritRate() { throw new Error(`getCritRate not implemented in child class ${this.constructor.name}`) }

	/** @returns {number} */
	getStaggerCap() { throw new Error(`getStaggerCap not implemented in child class ${this.constructor.name}`) }

	/** Get the number of stacks of the given modifier the combatant has
	 * @param {string} modifierName
	 */
	getModifierStacks(modifierName) {
		return this.modifiers[modifierName] ?? 0
	}

	getEssenceCounterDamage() {
		const baseBonus = 30 + (5 * this.level);
		if (this.getModifierStacks("Attunement") > 0) {
			return 2 * baseBonus;
		} else if (this.getModifierStacks("Incompatibility") > 0) {
			return Math.floor(baseBonus / 2);
		} else {
			return baseBonus;
		}
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
	}
	isReady = false;
	/** @type {Gear[]} */
	gear = [];
	pet = {
		type: "",
		level: 0
	};
	specialization = "base";
	startingArtifact = "";
	power = 75;

	getMaxHP() {
		return Math.floor(this.maxHP) * (1 + this.gear.reduce((totalGearMaxHP, gear) => {
			if (parseInt(gear.percentMaxHP)) {
				return totalGearMaxHP + gear.percentMaxHP;
			} else {
				return totalGearMaxHP;
			}
		}, 0) / 100);
	}

	getPower() {
		return Math.floor((this.power + this.getModifierStacks("Empowerment") - this.getModifierStacks("Weakness")) * (1 + this.gear.reduce((totalPower, gear) => {
			if (parseInt(gear.percentPower)) {
				return totalPower + gear.percentPower;
			} else {
				return totalPower;
			}
		}, 0) / 100));
	}

	/** @param {boolean} includeRoundSpeed */
	getSpeed(includeRoundSpeed) {
		const gearSpeed = this.gear.reduce((totalGearSpeed, gear) => {
			if (parseInt(gear.percentSpeed)) {
				return totalGearSpeed + gear.percentSpeed;
			} else {
				return totalGearSpeed;
			}
		}, 0);
		let totalSpeed = this.speed * (1 + gearSpeed / 100);
		if (includeRoundSpeed) {
			totalSpeed += this.roundSpeed;
		}
		if ("Torpidity" in this.modifiers) {
			const torpidityStacks = this.getModifierStacks("Torpidity");
			totalSpeed -= torpidityStacks * 5;
		}
		if ("Swiftness" in this.modifiers) {
			const swiftenessStacks = this.getModifierStacks("Swiftness");
			totalSpeed += swiftenessStacks * 5;
		}
		return Math.floor(totalSpeed);
	}

	getCritRate() {
		return Math.floor(this.critRate * (1 + this.gear.reduce((totalCritRate, gear) => {
			if (parseInt(gear.percentCritRate)) {
				return totalCritRate + gear.percentCritRate;
			} else {
				return totalCritRate;
			}
		}, 0)));
	}

	getStaggerCap() {
		return Math.floor(this.getMaxHP() / 50);
	}

	/** Game Design: constrain damage cap increases to multiples of 10, so a damage number ending in 9 can be a more reliable tell of hitting damage cap */
	getDamageCap() {
		const ringOfPowerCount = Object.keys(this.gear).filter(gearName => gearName.includes("Ring of Power")).length;
		return 179 + 20 * (this.level + this.getModifierStacks("Excellence") - this.getModifierStacks("Degredation") + (ringOfPowerCount * 3));
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
	 */
	constructor(nameInput, chargesInput, maxHPInput, powerInput, speedInput, critRateInput) {
		this.name = nameInput;
		this.charges = chargesInput;
		this.maxHP = maxHPInput;
		this.power = powerInput;
		this.speed = speedInput;
		this.critRate = critRateInput;
	}
	cooldown = 0;
};

module.exports = {
	Combatant,
	Delver,
	Gear
};
