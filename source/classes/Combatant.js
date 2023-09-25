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
	/** @type {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} */
	element;
	maxHP = 300;
	speed = 100;
	critBonus = 0;
	poise = 3;

	hp = 300;
	block = 0;
	crit = false;
	roundSpeed = 0;
	/** @type {{[modifierName: string]: number}} */
	modifiers = {};

	/** @returns {string} */
	getName() { }

	/** Get the number of stacks of the given modifier the combatant has
	 * @param {string} modifierName
	 */
	getModifierStacks(modifierName) {
		return this.modifiers[modifierName] ?? 0
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

	/**
	 * @param {string} archetypeName
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "Untyped"} elementEnum
	 */
	setArchetype(archetypeName, elementEnum) { //TODONOW destructure entire archetypeTemplate here
		this.archetype = archetypeName;
		this.element = elementEnum;
		return this;
	}

	getName() {
		return this.name;
	}
}

class Gear {
	/**
	 * @param {string} nameInput
	 * @param {number} durabilityInput
	 */
	constructor(nameInput, durabilityInput) {
		this.name = nameInput;
		this.durability = durabilityInput;
	}
};

module.exports = {
	Combatant,
	Delver,
	Gear
};
