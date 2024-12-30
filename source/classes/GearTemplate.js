const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");

class GearTemplate {
	/** This read-only data class defines stats for a piece of gear
	 * @param {string} nameInput
	 * @param {[type: "Requirement" | "Passive" | "use" | "Critical💥", description: string][]} descriptionTuples
	 * @param {"Offense" | "Defense" | "Support" | "Adventuring" | "Spell" | "Pact" | "Maneuver" | "Trinket" | "Action"} categoryInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} essenceEnum
	 * @param {number} costInput
	 * @param {(targets: Combatant[], user: Combatant, adventure: Adventure) => string[]} effectInput
	 */
	constructor(nameInput, descriptionTuples, categoryInput, essenceEnum, costInput, effectInput) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!categoryInput) throw new BuildError("Falsy categoryInput");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");
		if (!costInput && costInput !== 0) throw new BuildError("Nonzero falsy costInput");
		if (!effectInput) throw new BuildError("Falsy effectInput");

		this.name = nameInput;
		this.descriptions = descriptionTuples;
		this.category = categoryInput;
		this.essence = essenceEnum;
		this.cost = costInput;
		this.effect = effectInput;
	}
	// Internal Configuration
	/** @type {{type: "single" | "all" | "random→x" | "self" | "none" | "blast→x", team: "ally" | "foe" | "any" | "none"}} */
	targetingTags;
	/** @type {string[]} */
	upgrades = [];
	/** @type {string[]} */
	sidegrades = [];
	/** @type  {Record<string, number>} */
	rnConfig;

	// Requirements
	cooldown;
	maxCharges = Infinity;
	/** @type {[integer: number, descriptionTemplate: string]} */
	pactCost;
	moraleRequirement = 0;

	// Attributes
	critMultiplier = 2;
	/** @type {number} */
	damage;
	/** @type {number} */
	protection;
	/** @type {number} */
	healing;
	/** @type {number} */
	priority;
	/** @type {number} */
	stagger;
	/** @type {number} */
	bonus;
	/** @type {number} */
	bonus2;
	/** @type {{ name: string, stacks: number | { description: string, generator: (user: Combatant) => number } }[]} */
	modifiers;
	maxHP = 0;
	power = 0;
	speed = 0;
	critRate = 0;
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	/** @param {{type: "single" | "all" | "random→x" | "self" | "none" | "blast→x", team: "ally" | "foe" | "any" | "none"}} tagObject */
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
	setCooldown(integer) {
		this.cooldown = integer;
		return this;
	}

	/** @param {number} integer */
	setCharges(integer) {
		this.maxCharges = integer;
		return this;
	}

	/** @param {[integer: number, descriptionTemplate: string]} pactTuple */
	setPactCost(pactTuple) {
		this.pactCost = pactTuple;
		return this;
	}

	/** @param {number} integer */
	setMoraleRequirement(integer) {
		this.moraleRequirement = integer;
		return this;
	}

	/** @param {number} integer */
	setDamage(integer) {
		this.damage = integer;
		return this;
	}

	/** @param {number} integer */
	setProtection(integer) {
		this.protection = integer;
		return this;
	}

	/** @param {number} integer */
	setHealing(integer) {
		this.healing = integer;
		return this;
	}

	/** @param {number} numberInput */
	setCritMultiplier(numberInput) {
		this.critMultiplier = numberInput;
		return this;
	}

	/** @param {number} integer */
	setPriority(integer) {
		this.priority = integer;
		return this;
	}

	/** For description creation purposes, this stagger is separate from Essence Match Stagger and is assumed to always be applied. For conditional Stagger (eg on crit) use `setBonus()` instead.
	 * @param {number} integer
	 */
	setStagger(integer) {
		this.stagger = integer;
		return this;
	}

	/** @param {number} integer */
	setBonus(integer) {
		this.bonus = integer;
		return this;
	}

	/** @param {number} integer */
	setBonus2(integer) {
		this.bonus2 = integer;
		return this;
	}

	/** @param {...{ name: string, stacks: number | { description: string, generator: (user: Combatant) => number } }} modifiersArray */
	setModifiers(...modifiersArray) {
		this.modifiers = modifiersArray;
		return this;
	}

	/** @param {number} integer */
	setMaxHP(integer) {
		this.maxHP = integer;
		return this;
	}

	/** @param {number} integer */
	setPower(integer) {
		this.power = integer;
		return this;
	}

	/** @param {number} integer */
	setSpeed(integer) {
		this.speed = integer;
		return this;
	}

	/** @param {number} integer */
	setCritRate(integer) {
		this.critRate = integer;
		return this;
	}

	/** @param {import("discord.js").EmbedField} fieldObject */
	setFlavorText(fieldObject) {
		this.flavorText = fieldObject;
		return this;
	}

	/** @param {Record<string, number|Record<string,number>>} rnConfig */
	setRnConfig(rnConfig) {
		this.rnConfig = rnConfig;
		return this;
	}
};

module.exports = {
	GearTemplate
};
