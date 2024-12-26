const { Adventure } = require("./Adventure");
const { Combatant, Delver } = require("./Combatant");
const { CombatantReference } = require("./Move");

class PetTemplate {
	/**
	 * @param {string} nameInput
	 * @param {number} colorEnum
	 * @param {PetMoveTemplate[][]} moveFamilies
	 */
	constructor(nameInput, colorEnum, moveFamilies) {
		this.name = nameInput;
		this.color = colorEnum;
		this.moves = moveFamilies;
	}
};

class PetMoveTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {(owner: Delver, petRNs: {delverIndex: number, moveIndex: number, targetReferences: CombatantReference[], extras: number[]}) => CombatantReference[]} selectorFunction
	 * @param {(targets: Combatant[], owner: Delver, adventure: Adventure, petRNs: {delverIndex: number, moveIndex: number, targetReferences: CombatantReference[], extras: number[]}) => string[]} effectFunction
	 */
	constructor(nameInput, descriptionInput, selectorFunction, effectFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.selector = selectorFunction;
		this.effect = effectFunction;
	}
	/** @type {{name: string, stacks: number}[]} */
	modifiers;
	/** @type {("enemyIndex" | number)[]} */
	rnConfig;

	/** @param {...{name: string, stacks: number}} modifiersArray */
	setModifiers(...modifiersArray) {
		this.modifiers = modifiersArray;
		return this;
	}

	/** @param {("enemyIndex" | number)[]} rnTypes */
	setRnConfig(rnTypes) {
		this.rnConfig = rnTypes;
		return this;
	}
}


module.exports = { PetTemplate, PetMoveTemplate };
