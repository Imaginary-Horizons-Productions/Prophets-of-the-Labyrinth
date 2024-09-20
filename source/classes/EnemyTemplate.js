const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");
const { CombatantReference } = require("./Move");

/** @typedef {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} CombatantElement */

class EnemyTemplate {
	/**
	 * @param {string} nameInput
	 * @param {CombatantElement | "@{adventure}" | "@{adventureOpposite}" | "@{custom}"} elementEnum
	 * @param {number} maxHPInput
	 * @param {number} speedInput
	 * @param {string} poiseExpressionInput expression, where n = delver count, that parses to number of Stagger to Stun
	 * @param {number} critRateBonus multiplicative increase to base 1/5 crit chance
	 * @param {string} firstActionName use "random" for random move in enemy's move pool
	 * @param {boolean} isBoss sets enemy to not randomize HP and adds 15 critRate
	 */
	constructor(nameInput, elementEnum, maxHPInput, speedInput, poiseExpressionInput, critRateBonus, firstActionName, isBoss) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!elementEnum) throw new BuildError("Falsy elementEnum");
		if (!maxHPInput) throw new BuildError("Falsy maxHPInput");
		if (!speedInput) throw new BuildError("Falsy speedInput");
		if (!poiseExpressionInput) throw new BuildError("Falsy poiseExpression");
		if (!isBoss && isBoss !== false) throw new BuildError("Nonfalse falsy isBoss");
		const pendingCritRate = critRateBonus + (isBoss ? 15 : 0);
		if (!pendingCritRate && pendingCritRate !== 0) throw new BuildError("Nonzero falsy critRate");
		if (!firstActionName) throw new BuildError("Falsy firstActionName");

		this.name = nameInput;
		this.element = elementEnum;
		this.maxHP = maxHPInput;
		this.speed = speedInput;
		/** @type {string} expression, where n = delver count */
		this.poiseExpression = poiseExpressionInput;
		this.critRate = 20 + pendingCritRate;
		this.firstAction = firstActionName;
		this.shouldRandomizeHP = !isBoss;
	}
	/** @type {Record<string, {name: string, element: CombatantElement | "@{adventure}" | "@{adventureOpposite}", priority: number, effect: (targets: Combatant[], user: Combatant, isCrit: boolean, adventure: Adventure) => string, selector: (self: Combatant, adventure: Adventure) => CombatantReference[], next: string, combatFlavor?: string }>} */
	actions = {};
	/** @type {[modifierName: string]: number} */
	startingModifiers = {};
	/** @type {import("discord.js").EmbedField} */
	flavorText;

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
	 * @param {CombatantElement | "@{adventure}" | "@{adventureOpposite}"} actionsInput.element
	 * @param {string} actionsInput.description
	 * @param {number} actionsInput.priority
	 * @param {(targets: Combatant[], user: Combatant, isCrit: boolean, adventure: Adventure) => string[]} actionsInput.effect
	 * @param {(self: Combatant, adventure: Adventure) => CombatantReference[]} actionsInput.selector
	 * @param {boolean} actionsInput.needsLivingTargets Only enemies stay at 0 hp without game over, so only true if it can target an enemy
	 * @param {string} actionsInput.next
	 * @param {?string} actionsInput.combatFlavor
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
