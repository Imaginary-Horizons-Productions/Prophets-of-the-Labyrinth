const { Adventure } = require("./Adventure");
const { Combatant } = require("./Combatant");
const { CombatantReference } = require("./Move");

class ItemTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} essenceEnum
	 * @param {number} costInput
	 * @param {(self, adventure: Adventure) => CombatantReference[]} selectTargetsFunction
	 * @param {(targets: Combatant[], user: Combatant, adventure: Adventure) => string[]} effectFunction
	 */
	constructor(nameInput, descriptionInput, essenceEnum, costInput, selectTargetsFunction, effectFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.essence = essenceEnum;
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
