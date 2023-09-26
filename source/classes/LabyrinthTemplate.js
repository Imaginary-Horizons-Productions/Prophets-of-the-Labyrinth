class LabyrinthTemplate {
	/** This read-only data class defines the contents and properties of a specific labyrinth
	 * @param {string} nameInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementInput
	 * @param {number} maxDepthInput integer
	 * @param {number[]} bossRoomDepthsInput
	 * @param {Record<"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped", string[]} itemMap
	 * @param {Record<"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped", Record<"Cursed" | "Common" | "Rare", string[]>>} gearMap
	 * @param {Record<"Event" | "Battle" | "Merchant" | "Rest Site" | "Final Battle" | "Forge" | "Artifact Guardian" | "Treasure" | "Empty" |, string[]>} roomMap
	 */
	constructor(nameInput, elementInput, maxDepthInput, bossRoomDepthsInput, itemMap, gearMap, roomMap) {
		this.name = nameInput;
		this.element = elementInput;
		this.maxDepth = maxDepthInput;
		this.bossRoomDepths = bossRoomDepthsInput;
		this.availableItems = itemMap;
		this.availableGear = gearMap;
		this.availableRooms = roomMap;
	}
}

module.exports = { LabyrinthTemplate };
