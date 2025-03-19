const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");
const { Scaling } = require("./Scaling");

class GearFamily {
	/** This read-only data class defines how gear variants in an upgrade family are related
	 * @param {GearTemplate} baseGear
	 * @param {GearTemplate[]} upgradeArray
	 * @param {boolean} skipUpgradeLinking
	 */
	constructor(baseGear, upgradeArray, skipUpgradeLinking) {
		this.base = baseGear;
		this.upgrades = upgradeArray;
		this.skipUpgradeLinking = skipUpgradeLinking;
	}
}

class GearTemplate {
	/** This read-only data class defines stats for a piece of gear
	 * @param {string} nameInput
	 * @param {[type: "Requirement" | "Passive" | "use" | "critical", description: string][]} descriptionTuples
	 * @param {"Offense" | "Defense" | "Support" | "Adventuring" | "Spell" | "Pact" | "Maneuver" | "Trinket" | "Action"} categoryInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} essenceEnum
	 */
	constructor(nameInput, descriptionTuples, categoryInput, essenceEnum) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!categoryInput) throw new BuildError("Falsy categoryInput");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");

		this.name = nameInput;
		this.descriptions = descriptionTuples;
		this.category = categoryInput;
		this.essence = essenceEnum;
	}
	// Internal Configuration
	/** @type {(targets: Combatant[], user: Combatant, adventure: Adventure, overrides: Partial<MoveEffectOverrides>) => string[]} */
	effect;
	/** @type {{type: "single" | "all" | "random→x" | "self" | "none" | "blast→x", team: "ally" | "foe" | "any" | "none"}} */
	targetingTags;
	/** @type {string[]} */
	upgrades = [];
	/** @type {string[]} */
	sidegrades = [];
	/** @type  {Record<string, number>} */
	rnConfig;
	/** @type {Record<string, number | Scaling>} */
	scalings;
	cooldown;
	maxCharges = Infinity;
	/** @type {[integer: number, descriptionTemplate: string]} */
	pactCost;
	moraleRequirement = 0;
	/** @type {number} */
	stagger;
	/** @type {{ name: string, stacks: number | Scaling }[]} */
	modifiers;
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	/** @param {number} integer */
	setCost(integer) {
		this.cost = integer;
		return this;
	}

	/**
	 * overrides is a dict *parameter* whose values can be defaulted, but can also be clobbered for polymorphism.
	 * @param {(targets: Combatant[], user: Combatant, adventure: Adventure, overrides: Partial<MoveEffectOverrides>) => string[]} effectFunction
	 * @param {{type: "single" | "all" | "random→x" | "self" | "none" | "blast→x", team: "ally" | "foe" | "any" | "none"}} tagObject
	 */
	setEffect(effectFunction, tagObject) {
		this.effect = effectFunction;
		this.targetingTags = tagObject;
		return this;
	}

	/** @param {Record<string, number | Scaling>} scalingsMap */
	setScalings(scalingsMap) {
		this.scalings = scalingsMap;
		return this;
	}

	/** @param {...string} gearNames */
	setUpgrades(...gearNames) {
		for (const upgrade of gearNames) {
			this.upgrades.push(upgrade);
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

	/** For description creation purposes, this stagger is separate from Essence Match Stagger and is assumed to always be applied. For conditional Stagger (eg on crit) use `setScalings()` instead.
	 * @param {number} integer
	 */
	setStagger(integer) {
		this.stagger = integer;
		return this;
	}

	/** @param {...{ name: string, stacks: number | Scaling }} modifiersArray */
	setModifiers(...modifiersArray) {
		this.modifiers = modifiersArray;
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

/** read-only class defines a type for overrides */
class MoveEffectOverrides {
	/** @type {{delverIndex: number, moveIndex: number, targetReferences: CombatantReference[], extras: number[]}} */
	petRNs; // either the adventure.petRNs or one submitted during move resolution
}

module.exports = {
	GearFamily,
	GearTemplate
};
