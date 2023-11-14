const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");
const { Combatant } = require("./Combatant");
const { CombatantReference } = require("./Move");

class EnemyTemplate {
	/**
	 * @param {string} nameInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}" | "@{clone}"} elementEnum
	 * @param {number} maxHPInput
	 * @param {number} speedInput
	 * @param {string} poiseExpressionInput expression, where n = delver count, that parses to number of Stagger to Stun
	 * @param {number} critBonusPercent multiplicative increase to base 1/4 crit chance
	 * @param {string} firstActionName use "random" for random move in enemy's move pool
	 * @param {boolean} isBoss sets enemy to not randomize HP and adds 15 critBonus
	 */
	constructor(nameInput, elementEnum, maxHPInput, speedInput, poiseExpressionInput, critBonusPercent, firstActionName, isBoss) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!elementEnum) throw new BuildError("Falsy elementEnum");
		if (!maxHPInput) throw new BuildError("Falsy maxHPInput");
		if (!speedInput) throw new BuildError("Falsy speedInput");
		if (!poiseExpressionInput) throw new BuildError("Falsy poiseExpression");
		if (!isBoss && isBoss !== false) throw new BuildError("Nonfalse falsy isBoss");
		const pendingCritBonus = critBonusPercent + (isBoss ? 15 : 0);
		if (!pendingCritBonus && pendingCritBonus !== 0) throw new BuildError("Nonzero falsy critBonus");
		if (!firstActionName) throw new BuildError("Falsy firstActionName");

		this.name = nameInput;
		this.element = elementEnum;
		this.maxHP = maxHPInput;
		this.speed = speedInput;
		/** @type {string} expression, where n = delver count */
		this.poiseExpression = poiseExpressionInput;
		this.critBonus = pendingCritBonus;
		this.firstAction = firstActionName;
		this.shouldRandomizeHP = !isBoss;
	}
	/** @type {Record<string, {name: string, element: "Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}", priority: number, effect: (targets: Combatant[], user: Combatant, isCrit: boolean, adventure: Adventure) => string, selector: (self: Combatant, adventure: Adventure) => CombatantReference[], next: (actionName: string) => string}>} */
	actions = {};
	/** @type {[modifierName: string]: number} */
	startingModifiers = {};

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
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}"} actionsInput.element
	 * @param {number} actionsInput.priority
	 * @param {(targets: Combatant[], user: Combatant, isCrit: boolean, adventure: Adventure) => string} actionsInput.effect
	 * @param {(self: Combatant, adventure: Adventure) => CombatantReference[]} actionsInput.selector
	 * @param {boolean} actionsInput.needsLivingTargets Only enemies stay at 0 hp without game over, so only true if it can target an enemy
	 * @param {(actionName: string) => string} actionsInput.next
	 */
	addAction(actionsInput) {
		this.actions[actionsInput.name] = actionsInput;
		return this;
	}
};


module.exports = {
	EnemyTemplate
};
