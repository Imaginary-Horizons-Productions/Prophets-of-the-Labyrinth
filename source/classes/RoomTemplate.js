const { ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { Adventure } = require("./Adventure");
const { BuildError } = require("./BuildError");

class RoomTemplate {
	/** This read-only data class defines stats for a room
	 * @param {string} titleText room titles double as the id, so must be unique
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned" | "@{adventure}" | "@{adventureOpposite}" | "@{adventureCounter}"} essenceEnum
	 * @param {string} descriptionInput
	 * @param {(adventure: Adventure) => ({ type: "Gear" | "Item", count: number, visibility: "always" | "interal" | "loot", forSale: boolean, uiGroup?: string }[])} initializeFunction
	 * @param {(roomEmbed: EmbedBuilder, adventure: Adventure) => {embeds: EmbedBuilder[], components: ActionRowBuilder[]}} buildRoomFunction
	 */
	constructor(titleText, essenceEnum, descriptionInput, initializeFunction, buildRoomFunction) {
		if (!titleText) throw new BuildError("Falsy titleText");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!initializeFunction) throw new BuildError("Falsy buildHistoryFunction");
		if (!buildRoomFunction) throw new BuildError("Falsy buildRoomFunction");

		this.title = titleText;
		this.essence = essenceEnum;
		this.description = descriptionInput;
		this.init = initializeFunction;
		this.buildRoom = buildRoomFunction;
	}
	/** @type {[enemyName: string, countExpression: string][]} */
	enemyList = [];

	/** @param {[enemyName: string, countExpression: string][]} enemyListInput */
	setEnemies(enemyListInput) {
		this.enemyList = enemyListInput;
		return this;
	}
};

module.exports = { RoomTemplate };
