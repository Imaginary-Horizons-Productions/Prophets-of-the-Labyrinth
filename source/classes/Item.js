class ItemTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {"Fire" | "Earth" | "Untyped" | "Water" | "Wind"} elementLabel
	 * @param {{description: "single" | "all" | "random→x" | "self" | "none", team: "delver" | "enemy" | "any" | "none"}} targetTags Unlike the selector function which controls the game logic, these tags control UI/feedback logic
	 * @param {number} costInput
	 * @param {(userTeam: "delver" | "enemy" | "none", userIndex: number, adventure) => []} selectTargetsFunction
	 * @param {(targets, user, isCrit: boolean, adventure) => string} effectFunction
	 */
	constructor(nameInput, descriptionInput, elementLabel, targetTags, costInput, selectTargetsFunction, effectFunction) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.element = elementLabel;
		this.targetDescription = targetTags.description;
		this.targetTeam = targetTags.team;
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

module.exports.ItemTemplate = ItemTemplate;
