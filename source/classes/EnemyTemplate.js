const { Adventure } = require("./Adventure");
const { Combatant } = require("./Combatant");
const { CombatantReference } = require("./Move");

class EnemyTemplate {
	/**
	 * @param {string} nameInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}" | "@{clone}"} elementEnum
	 * @param {number} maxHPInput
	 * @param {number} speedInput
	 * @param {number} poiseInput number of Stagger to Stun
	 * @param {number} critBonusPercent multiplicative increase to base 1/4 crit chance
	 * @param {string} firstActionName use "random" for random move in enemy's move pool
	 * @param {boolean} isBoss sets enemy to not randomize HP and adds 15 critBonus
	 */
	constructor(nameInput, elementEnum, maxHPInput, speedInput, poiseInput, critBonusPercent, firstActionName, isBoss) {
		this.name = nameInput;
		this.element = elementEnum;
		this.maxHP = maxHPInput;
		this.speed = speedInput;
		this.poise = poiseInput;
		this.critBonus = critBonusPercent + (isBoss ? 15 : 0);
		this.firstAction = firstActionName;
		this.shouldRandomizeHP = !isBoss;
	}
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
	 * @param {function} actionsInput.next
	 */
	addAction(actionsInput) {
		this.actions[actionsInput.name] = actionsInput;
		return this;
	}
};


module.exports = {
	EnemyTemplate
};
