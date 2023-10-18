const { ActionRowBuilder } = require("discord.js");
const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");

class RoomTemplate {
	/** This read-only data class defines stats for a room
	 * @param {string} titleText room titles double as the id, so must be unique
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}" | "@{adventureWeakness}"} elementEnum
	 * @param {string} descriptionInput
	 * @param {ResourceTemplate[]} resourceArray
	 */
	constructor(titleText, elementEnum, descriptionInput, resourceArray) {
		if (!titleText) throw new BuildError("Falsy titleText");
		if (!elementEnum) throw new BuildError("Falsy elementEnum");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!resourceArray) throw new BuildError("Falsy resourceArray");

		this.title = titleText;
		this.element = elementEnum;
		this.description = descriptionInput;
		this.resourceList = resourceArray;
	}
	/** @type {Record<string, string>} */
	enemyList = {};
	/** @type {((adventure: Adventure) => ActionRowBuilder[]) | null} */
	buildUI = null;

	/**
	 * @param {string} enemyName
	 * @param {string} countExpression
	 */
	addEnemy(enemyName, countExpression) {
		this.enemyList[enemyName] = countExpression;
		return this;
	}

	/** @param {(adventure: Adventure) => ActionRowBuilder[]} buildUIFunction */
	setBuildUI(buildUIFunction) {
		this.buildUI = buildUIFunction;
		return this;
	}
};

class ResourceTemplate {
	/** This read-only data class that defines resources available for placement in rooms
	 * @param {string} countExpression
	 * @param {"loot" | "always" | "internal"} visibilityInput "loot" only shows in end of room loot, "always" always shows in ui, "internal" never shows in ui
	 * @param {"gear" | "artifact" | "gold" | "roomAction" | "challenge" | "item" | string} typeInput categories (eg "item", "gear") are random rolls, specific names allowed
	 */
	constructor(countExpression, visibilityInput, typeInput) {
		if (!countExpression) throw new BuildError("Falsy countExpression");
		if (!visibilityInput) throw new BuildError("Falsy visibilityInput");
		if (!typeInput) throw new BuildError("Falsy typeInput");

		this.count = countExpression;
		this.visibility = visibilityInput;
		if (visibilityInput === "loot") {
			this.costExpression = "0";
		} else {
			this.costExpression = "n";
		}
		this.type = typeInput;
	}
	/** @type {"Cursed" | "Common" | "Rare" | "?"} */
	tier = null;
	/** @type {string} */
	uiGroup = null;

	/** @param {"Cursed" | "Common" | "Rare" | "?"} tierEnum */
	setTier(tierEnum) {
		this.tier = tierEnum;
		return this;
	}

	/** @param {string} costExpressionInput */
	setCostExpression(costExpressionInput) {
		this.costExpression = costExpressionInput;
		return this;
	}

	/** @param {string} groupName for UI with multiple selects (eg merchants) */
	setUIGroup(groupName) {
		this.uiGroup = groupName;
		return this;
	}
};

module.exports = {
	RoomTemplate,
	ResourceTemplate
};
