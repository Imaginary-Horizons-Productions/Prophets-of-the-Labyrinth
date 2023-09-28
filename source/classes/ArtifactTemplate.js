const { calculateTagContent } = require("../util/textUtil");
const { BuildError } = require("./BuildError");

class ArtifactTemplate {
	/**
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {string} scalingDescriptionInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementEnum
	 */
	constructor(nameInput, descriptionInput, scalingDescriptionInput, elementEnum) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!scalingDescriptionInput) throw new BuildError("Falsy scalingDescriptionInput");
		if (!elementEnum) throw new BuildError("Falsy elementEnum");

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
