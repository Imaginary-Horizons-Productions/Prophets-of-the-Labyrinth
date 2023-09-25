const { ActionRowBuilder } = require("discord.js");
const { Adventure } = require("./Adventure");

class RoomTemplate {
	/** This read-only data class defines stats for a room
	 * @param {string} titleText room titles double as the id, so must be unique (likely to change for localization)
	 * @param {"Fire" | "Water" | "Wind" | "Earth" | "Untyped" | "@{adventure}" | "@{adventureOpposite}"} elementEnum
	 * @param {string} descriptionInput
	 * @param {ResourceTemplate[]} resourceArray
	 */
	constructor(titleText, elementEnum, descriptionInput, resourceArray) {
		this.title = titleText;
		this.element = elementEnum;
		this.description = descriptionInput;
		this.resourceList = resourceArray;
	}
	enemyList = {};

	/**
	 * @param {Adventure} adventure
	 * @returns {ActionRowBuilder[]}
	 */
	buildUI(adventure) { return [] };

	/**
	 * @param {string} enemyName
	 * @param {string} countExpression
	 */
	addEnemy(enemyName, countExpression) {
		this.enemyList[enemyName] = countExpression;
		return this;
	}
};

class ResourceTemplate {
	/** This read-only data class that defines resources available for placement in rooms
	 * @param {string} countExpression
	 * @param {"loot" | "always" | "internal"} visibilityInput "loot" only shows in end of room loot, "always" always shows in ui, "internal" never shows in ui
	 * @param {"gear" | "artifact" | "gold" | "scouting" | "roomAction" | "challenge" | "item"} resourceTypeInput
	 */
	constructor(countExpression, visibilityInput, resourceTypeInput) {
		this.count = countExpression;
		this.visibility = visibilityInput;
		this.resourceType = resourceTypeInput;
	}
	/** @type {"Cursed" | "Common" | "Rare" | "?"} */
	tier = null;
	/** @type {string} */
	cost = null;
	/** @type {string} */
	uiGroup = null;

	/** @param {"Cursed" | "Common" | "Rare" | "?"} tierEnum */
	setTier(tierEnum) {
		this.tear = tierEnum;
		return this;
	}

	/** @param {number} integer */
	setCost(integer) {
		this.cost = integer;
		return this;
	}

	/** @param {string} groupName Only necessary for UI with multiple generated selects (eg merchants) */
	setUIGroup(groupName) {
		this.uiGroup = groupName;
		return this;
	}
};

module.exports = {
	RoomTemplate,
	ResourceTemplate
};
