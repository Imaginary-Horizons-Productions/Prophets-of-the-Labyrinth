const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");
const { CombatantReference } = require("./Move");
const { Receipt } = require("./Receipt");

/** @typedef {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} Essence */

class EnemyTemplate {
	/**
	 * @param {string} nameInput
	 * @param {Essence | "@{adventure}" | "@{adventureOpposite}" | "@{custom}"} essenceEnum
	 * @param {number} maxHPInput
	 * @param {number} speedInput
	 * @param {string} staggerCapExpressionInput expression, where n = delver count, that parses to number of Stagger to Stun
	 * @param {number} critRateBonus multiplicative increase to base 1/5 crit chance
	 * @param {string} firstActionName use "random" for random move in enemy's move pool
	 * @param {boolean} isBoss sets enemy to not randomize HP and adds 15 critRate
	 */
	constructor(nameInput, essenceEnum, maxHPInput, speedInput, staggerCapExpressionInput, critRateBonus, firstActionName, isBoss) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");
		if (!maxHPInput) throw new BuildError("Falsy maxHPInput");
		if (!speedInput) throw new BuildError("Falsy speedInput");
		if (!staggerCapExpressionInput) throw new BuildError("Falsy staggerCapExpressionInput");
		if (!isBoss && isBoss !== false) throw new BuildError("Nonfalse falsy isBoss");
		const pendingCritRate = critRateBonus + (isBoss ? 15 : 0);
		if (!pendingCritRate && pendingCritRate !== 0) throw new BuildError("Nonzero falsy critRate");
		if (!firstActionName) throw new BuildError("Falsy firstActionName");

		this.name = nameInput;
		this.essence = essenceEnum;
		this.maxHP = maxHPInput;
		this.speed = speedInput;
		/** @type {string} expression, where n = delver count */
		this.staggerCapExpression = staggerCapExpressionInput;
		this.critRate = 20 + pendingCritRate;
		this.firstAction = firstActionName;
		this.shouldRandomizeHP = !isBoss;
	}
	/** @type {Record<string, {name: string, essence: Essence | "@{adventure}" | "@{adventureOpposite}", priority: number, effect: (targets: Combatant[], user: Combatant, adventure: Adventure) => string, selector: (self: Combatant, adventure: Adventure) => CombatantReference[], next: string, combatFlavor?: string }>} */
	actions = {};
	/** @type {[modifierName: string]: number} */
	startingModifiers = {};
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	/**
	 * @param {number} integer
	 * Can be used to adjust maxHP during spawnEnemy (e.g. ads are more fragile than the original)
	 * */
	setMaxHP(integer) {
		this.maxHP = integer;
		return this;
	}

	/** @param {number} integer */
	setPower(integer) {
		this.power = integer;
		return this;
	}

	/**
	 * @param {string} modifier
	 * @param {number} stacks
	 */
	addStartingModifier(modifier, stacks) {
		this.startingModifiers[modifier] = stacks;
		return this;
	}

	/** Set the name, effect, target selector, and move selector of an enemy attack
	 * @param {object} actionsInput
	 * @param {string} actionsInput.name
	 * @param {Essence | "@{adventure}" | "@{adventureOpposite}"} actionsInput.essence
	 * @param {string} actionsInput.description
	 * @param {number} actionsInput.priority
	 * @param {(targets: Combatant[], user: Combatant, adventure: Adventure) => (string | Receipt)[]} actionsInput.effect
	 * @param {(self: Combatant, adventure: Adventure) => CombatantReference[]} actionsInput.selector
	 * @param {string | (currentAction: string, adventure: Adventure) => string} actionsInput.next
	 * @param {?string} actionsInput.combatFlavor
	 * @param {Record<string,number|Record<string,number>>} actionsInput.rnConfig
	 */
	addAction(actionsInput) {
		this.actions[actionsInput.name] = actionsInput;
		return this;
	}

	/** @param {import("discord.js").EmbedField} fieldObject */
	setFlavorText(fieldObject) {
		this.flavorText = fieldObject;
		return this;
	}
};


module.exports = {
	EnemyTemplate
};
