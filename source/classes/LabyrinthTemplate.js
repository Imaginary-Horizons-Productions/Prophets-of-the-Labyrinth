const { BuildError } = require("./BuildError");

class LabyrinthTemplate {
	/** This read-only data class defines the contents and properties of a specific labyrinth
	 * @param {string} nameInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementInput
	 * @param {string} descriptionInput
	 * @param {number} maxDepthInput integer
	 * @param {number[]} bossRoomDepthsInput
	 * @param {Record<"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped", string[]} itemMap
	 * @param {Record<"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped", Record<"Cursed" | "Common" | "Rare", string[]>>} gearMap
	 * @param {Record<"Event" | "Battle" | "Merchant" | "Rest Site" | "Final Battle" | "Workshop" | "Artifact Guardian" | "Treasure" | "Empty", string[]>} roomMap if a room category is rolled, it rolls again on that category
	 */
	constructor(nameInput, elementInput, descriptionInput, maxDepthInput, bossRoomDepthsInput, itemMap, gearMap, roomMap) {
		if (!nameInput) throw new BuildError("Falsy nameInput");
		if (!elementInput) throw new BuildError("Falsy elementInput");
		if (!descriptionInput) throw new BuildError("Falsy descriptionInput");
		if (!maxDepthInput && maxDepthInput !== 0) throw new BuildError("Nonzero falsy maxDepthInput");
		if (!bossRoomDepthsInput) throw new BuildError("Falsy bossRoomDepthsInput");
		if (!itemMap) throw new BuildError("Falsy itemMap");
		if (!gearMap) throw new BuildError("Falsy gearMap");
		if (!roomMap) throw new BuildError("Falsy roomMap");

		this.name = nameInput;
		this.element = elementInput;
		this.description = descriptionInput;
		this.maxDepth = maxDepthInput;
		this.bossRoomDepths = bossRoomDepthsInput;
		this.availableItems = itemMap;
		this.availableGear = gearMap;
		this.availableRooms = roomMap;
	}
}

module.exports = { LabyrinthTemplate };
