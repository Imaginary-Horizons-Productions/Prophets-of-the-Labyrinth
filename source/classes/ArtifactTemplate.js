const { calculateTagContent } = require("../util/textUtil");
const { BuildError } = require("./BuildError");

class ArtifactTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {string} scalingDescriptionInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} essenceEnum
	 * @param {number} costInteger
	 */
	constructor(nameInput, descriptionInput, scalingDescriptionInput, essenceEnum, costInteger) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!scalingDescriptionInput) throw new BuildError("Falsy scalingDescriptionInput");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");

		this.name = nameInput;
		this.description = descriptionInput;
		this.scalingDescription = scalingDescriptionInput;
		this.essence = essenceEnum;
		this.cost = costInteger;
	}
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	/** @param {number} copies */
	dynamicDescription(copies) {
		return calculateTagContent(this.description, { copies });
	}

	/** @param {import("discord.js").EmbedField} embedFieldData */
	setFlavorText(embedFieldData) {
		this.flavorText = embedFieldData;
		return this;
	}
};

module.exports = {
	ArtifactTemplate
};
