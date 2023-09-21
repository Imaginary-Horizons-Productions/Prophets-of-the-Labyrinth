class GearTemplate {
	/** This read-only data class defines stats for a piece of equipment
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {string} critDescriptionInput
	 * @param {"Weapon" | "Armor" | "Spell" | "Pact" | "Trinket" | "Technique"} categoryInput
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "Untyped"} elementInput
	 * @param {number} costInput
	 * @param {(targets, user, isCrit: boolean, adventure) => string} effectInput
	 */
	constructor(nameInput, descriptionInput, critDescriptionInput, categoryInput, elementInput, costInput, effectInput) {
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
	/** @type {{name: string, stacks: number}[]} */
	modifiers;

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

	/** @param {{name: string, stacks: number}[]} modifiersArray */
	setModifiers(modifiersArray) {
		this.modifiers = modifiersArray;
		return this;
	}
};

class Gear {
	constructor(nameInput, durabilityInput) {
		this.name = nameInput;
		this.durability = durabilityInput;
	}
};

module.exports = {
	Gear,
	GearTemplate
};
