const { BuildError } = require("./BuildError");

/** @typedef {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} Essence */

class LabyrinthTemplate {
	/** This read-only data class defines the contents and properties of a specific labyrinth
	 * @param {string} nameInput
	 * @param {Essence} essenceEnum
	 * @param {string} descriptionInput
	 * @param {number} maxDepthInteger
	 * @param {number[]} bossRoomDepthsInput
	 * @param {Record<Essence, string[]} itemMap
	 * @param {Record<Essence, Record<"Cursed" | "Common" | "Rare", string[]>>} gearMap
	 * @param {Record<"Event" | "Battle" | "Merchant" | "Rest Site" | "Workshop" | "Library" | "Guildstop" | "Artifact Guardian" | "Treasure" | "Final Battle" | "Empty", string[]>} roomMap if a room category is rolled, it rolls again on that category
	 */
	constructor(nameInput, essenceEnum, descriptionInput, maxDepthInteger, bossRoomDepthsInput, itemMap, gearMap, roomMap) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!essenceEnum) throw new BuildError("Falsy essenceEnum");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!maxDepthInteger && maxDepthInteger !== 0) throw new BuildError("Nonzero falsy maxDepthInput");
		if (!bossRoomDepthsInput) throw new BuildError("Falsy bossRoomDepthsInput");
		if (!itemMap) throw new BuildError("Falsy itemMap");
		if (!gearMap) throw new BuildError("Falsy gearMap");
		if (!roomMap) throw new BuildError("Falsy roomMap");

		this.name = nameInput;
		this.essence = essenceEnum;
		this.description = descriptionInput;
		this.maxDepth = maxDepthInteger;
		this.bossRoomDepths = bossRoomDepthsInput;
		this.availableItems = itemMap;
		this.availableGear = gearMap;
		this.availableRooms = roomMap;
	}
}

module.exports = { LabyrinthTemplate };
