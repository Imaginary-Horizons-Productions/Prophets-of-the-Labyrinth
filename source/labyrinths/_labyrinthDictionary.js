const { Adventure, LabyrinthTemplate } = require("../classes");
const { gearExists } = require("../gear/_gearDictionary.js");
const { itemExists } = require("../items/_itemDictionary.js");
const { getRoom } = require("../rooms/_roomDictionary");

/** @type {Record<string, LabyrinthTemplate>} */
const LABYRINTHS = {};

for (const file of [
	"debugdungeon.js"
]) {
	/** @type {LabyrinthTemplate} */
	const labyrinth = require(`./${file}`);
	for (const element in labyrinth.availableItems) {
		for (const consumable of labyrinth.availableItems[element]) {
			if (!itemExists(consumable)) {
				console.error(`Unregistered consumable name in ${labyrinth.name}: ${consumable}`);
			}
		}
	}

	for (const element in labyrinth.availableGear) {
		for (const rarity in labyrinth.availableGear[element]) {
			for (const equipment of labyrinth.availableGear[element][rarity]) {
				if (!gearExists(equipment)) {
					console.error(`Unregistered equipment name in ${labyrinth.name}: ${equipment}`);
				}
			}
		}
	}

	for (const tag in labyrinth.availableRooms) {
		for (const roomTitle of labyrinth.availableRooms[tag]) {
			if (!getRoom(roomTitle)) {
				console.error(`Unregistered room title in ${labyrinth.name}: ${roomTitle}`);
			}
		}
	}
	LABYRINTHS[labyrinth.name] = labyrinth;
}

/** Lookup static property of a labyrinth by labyrinth name
 * @param {string} labyrinthName
 * @param {string} propertyName
 * @returns {unknown}
 */
exports.getLabyrinthProperty = function (labyrinthName, propertyName) {
	if (labyrinthName in LABYRINTHS) {
		const template = LABYRINTHS[labyrinthName];
		if (propertyName in template) {
			return template[propertyName];
		} else {
			console.error(`Property ${propertyName} not found in ${labyrinthName}`);
		}
	} else {
		console.error(`Labyrinth name ${labyrinthName} not recognized`);
	}
}

/** Rolls a consumable's name from droppable consumables
 * @param {Adventure} adventure
 * @returns {string}
 */
exports.rollItem = function (adventure) {
	const itemPool = adventure.getElementPool().flatMap((element) => LABYRINTHS[adventure.labyrinth].availableConsumables[element]);

	return itemPool[adventure.generateRandomNumber(itemPool.length, "general")];
}

/** Filters by party element pool and given tier, then rolls a random equipment's name
 * @param {"Cursed" | "Common" | "Rare"} tier
 * @param {Adventure} adventure
 * @returns {string} the name of the dropped equipment
 */
exports.rollGear = function (tier, adventure) {
	const pool = adventure.getElementPool().flatMap(element => LABYRINTHS[adventure.labyrinth].availableEquipment[element][tier]);
	return pool[adventure.generateRandomNumber(pool.length, "general")];
}

/** Internally decide the next boss of the given type, so scouting can provide that information
 * @param {"Final Battle" | "Artifact Guardian"} type
 * @param {Adventure} adventure
 */
exports.prerollBoss = function (type, adventure) {
	const roomPool = LABYRINTHS[adventure.labyrinth].availableRooms[type];
	const roomTitle = roomPool[adventure.generateRandomNumber(roomPool.length, "general")];
	if (type === "Artifact Guardian") {
		adventure.artifactGuardians.push(roomTitle);
	} else {
		adventure.finalBoss = roomTitle;
	}
}

/** Filters by type, then rolls a random room or returns the scouted room
 * @param {"Event" | "Battle" | "Merchant" | "Rest Site" | "Final Battle" | "Forge" | "Artifact Guardian" | "Treasure" | "Empty"} type Room Types are internal tags that describe the contents of the room for randomization bucketing/UI generation purposes
 * @param {Adventure} adventure
 * @returns {RoomTemplate}
 */
exports.rollRoom = function (type, adventure) {
	if (type === "Artifact Guardian") {
		return getRoom(adventure.artifactGuardians[adventure.scouting.artifactGuardiansEncountered]);
	}

	if (type === "Final Battle") {
		return getRoom(adventure.finalBoss);
	}

	if (!(type in LABYRINTHS[adventure.labyrinth].availableRooms)) {
		console.error("Attempt to create room of unidentified type: " + type);
		adventure.roomCandidates = {};
		adventure.roomCandidates[`Battle${SAFE_DELIMITER}${adventure.depth}`] = true;
		return LABYRINTHS["Debug Dungeon"].availableRooms["Empty"][0];
	}
	const roomPool = LABYRINTHS[adventure.labyrinth].availableRooms[type];
	return getRoom(roomPool[adventure.generateRandomNumber(roomPool.length, "general")]);
}
