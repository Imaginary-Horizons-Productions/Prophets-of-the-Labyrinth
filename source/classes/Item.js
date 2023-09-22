const { CombatantReference } = require("./Combatant");

class ItemTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} elementLabel
	 * @param {number} costInput
	 * @param {(self, adventure) => CombatantReference[]} selectTargetsFunction
	 * @param {(targets, user, isCrit: boolean, adventure) => string} effectFunction
	 */
	constructor(nameInput, descriptionInput, elementLabel, costInput, selectTargetsFunction, effectFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.element = elementLabel;
		this.cost = costInput;
		this.selectTargets = selectTargetsFunction;
		this.effect = effectFunction;
	}
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	/** @param {import("discord.js").EmbedField} fieldObject */
	setFlavorText(fieldObject) {
		this.flavorText = fieldObject;
		return this;
	}
};

module.exports = { ItemTemplate };
