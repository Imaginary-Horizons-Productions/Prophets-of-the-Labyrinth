const { calculateTagContent } = require("../util/textUtil");

class ArtifactTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {string} scalingDescriptionInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementEnum
	 */
	constructor(nameInput, descriptionInput, scalingDescriptionInput, elementEnum) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.scalingDescription = scalingDescriptionInput;
		this.element = elementEnum;
	}
	/** @type {import("discord.js").EmbedField} */
	flavorText;

	/** @param {number} copies */
	dynamicDescription(copies) {
		return calculateTagContent(this.description, [{ tag: 'copies', count: copies }]);
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
