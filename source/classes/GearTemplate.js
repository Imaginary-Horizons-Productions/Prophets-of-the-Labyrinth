const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");

class GearTemplate {
	/** This read-only data class defines stats for a piece of gear
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {string} critDescriptionInput
	 * @param {"Weapon" | "Armor" | "Spell" | "Pact" | "Trinket" | "Technique"} categoryInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementInput
	 * @param {number} costInput
	 * @param {(targets: Combatant[], user: Combatant, isCrit: boolean, adventure: Adventure) => string} effectInput
	 */
	constructor(nameInput, descriptionInput, critDescriptionInput, categoryInput, elementInput, costInput, effectInput) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!critDescriptionInput) throw new BuildError("Falsy critDescriptionInput");
		if (!categoryInput) throw new BuildError("Falsy categoryInput");
		if (!elementInput) throw new BuildError("Falsy elementInput");
		if (!costInput && costInput !== 0) throw new BuildError("Nonzero falsy costInput");
		if (!effectInput) throw new BuildError("Falsy effectInput");

		this.name = nameInput;
		this.description = descriptionInput;
		this.critDescription = critDescriptionInput;
		this.category = categoryInput;
		this.element = elementInput;
		this.cost = costInput;
		this.effect = effectInput;
	}
	/** @type {{target: "single" | "all" | "random→x" | "self" | "none", team: "delver" | "enemy" | "any" | "none"}} */
	targetingTags;
	maxDurability = 0;
	/** @type {string[]} */
	upgrades = [];
	/** @type {string[]} */
	sidegrades = [];
	critBonus = 2;
	/** @type {number} */
	damage;
	/** @type {number} */
	bonus;
	/** @type {number} */
	block;
	/** @type {number} */
	hpCost;
	/** @type {number} */
	healing;
	/** @type {number} */
	priority;
	/** @type {number} */
	stagger;
	/** @type {{name: string, stacks: number}[]} */
	modifiers;
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	/** @param {{target: "single" | "all" | "random→x" | "self" | "none", team: "delver" | "enemy" | "any" | "none"}} tagObject */
	setTargetingTags(tagObject) {
		this.targetingTags = tagObject;
		return this;
	}

	/** @param {...string} gearNames */
	setUpgrades(...gearNames) {
		for (const upgrade of gearNames) {
			this.upgrades.push(upgrade);
		}
		return this;
	}

	/** @param {...string} gearNames */
	setSidegrades(...gearNames) {
		for (const sidegrade of gearNames) {
			this.sidegrades.push(sidegrade);
		}
		return this;
	}

	/** @param {number} integer */
	setDurability(integer) {
		this.maxDurability = integer;
		return this;
	}

	/** @param {number} integer */
	setDamage(integer) {
		this.damage = integer;
		return this;
	}

	/** @param {number} integer */
	setBonus(integer) {
		this.bonus = integer;
		return this;
	}

	/** @param {number} numberInput */
	setCritBonus(numberInput) {
		this.critBonus = numberInput;
		return this;
	}

	/** @param {number} integer */
	setBlock(integer) {
		this.block = integer;
		return this;
	}

	/** @param {number} integer */
	setHPCost(integer) {
		this.hpCost = integer;
		return this;
	}

	/** @param {number} integer */
	setHealing(integer) {
		this.healing = integer;
		return this;
	}

	/** @param {number} integer */
	setPriority(integer) {
		this.priority = integer;
		return this;
	}

	/** @param {number} integer */
	setStagger(integer) {
		this.stagger = integer;
		return this;
	}

	/** @param {...{name: string, stacks: number}} modifiersArray */
	setModifiers(...modifiersArray) {
		this.modifiers = modifiersArray;
		return this;
	}

	/** @param {import("discord.js").EmbedField} fieldObject */
	setFlavorText(fieldObject) {
		this.flavorText = fieldObject;
		return this;
	}
};

module.exports = {
	GearTemplate
};
