const { Adventure, LabyrinthTemplate, RoomTemplate } = require("../classes");
const { gearExists } = require("../gear/_gearDictionary.js");
const { itemExists } = require("../items/_itemDictionary.js");
const { getRoom, ROOM_CATEGORIES } = require("../rooms/_roomDictionary");

/** @type {Record<string, LabyrinthTemplate>} */
const LABYRINTHS = {};

for (const file of [
	"debugdungeon.js",
	"castleofthecelestialknights.js",
	"everythingbagel.js",
	"mechahive.js",
	"zooofchimeras.js"
]) {
	/** @type {LabyrinthTemplate} */
	const labyrinth = require(`./${file}`);
	for (const element in labyrinth.availableItems) {
		for (const item of labyrinth.availableItems[element]) {
			if (!itemExists(item)) {
				console.error(`Unregistered item name in ${labyrinth.name}: ${item}`);
			}
		}
	}

	for (const element in labyrinth.availableGear) {
		for (const rarity in labyrinth.availableGear[element]) {
			for (const gear of labyrinth.availableGear[element][rarity]) {
				if (!gearExists(gear)) {
					console.error(`Unregistered gear name in ${labyrinth.name}: ${gear}`);
				}
			}
		}
	}

	for (const tag in labyrinth.availableRooms) {
		for (const roomTitle of labyrinth.availableRooms[tag]) {
			if (!(ROOM_CATEGORIES.includes(roomTitle) || getRoom(roomTitle))) {
				console.error(`Unregistered room title in ${labyrinth.name}: ${roomTitle}`);
			}
		}
	}
	LABYRINTHS[labyrinth.name] = labyrinth;
}

/** @param {string} labyrinthName */
function labyrinthExists(labyrinthName) {
	return labyrinthName in LABYRINTHS
};

/** Lookup static property of a labyrinth by labyrinth name
 * @param {string} labyrinthName
 * @param {string} propertyName
 * @returns {unknown}
 */
function getLabyrinthProperty(labyrinthName, propertyName) {
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

/** Rolls a item's name from droppable items
 * @param {Adventure} adventure
 * @returns {string}
 */
function rollItem(adventure) {
	const itemPool = adventure.getElementPool().flatMap((element) => LABYRINTHS[adventure.labyrinth].availableItems[element]);

	return itemPool[adventure.generateRandomNumber(itemPool.length, "general")];
}

/** Filters by party element pool and given tier, then rolls a random gear's name
 * @param {"Cursed" | "Common" | "Rare"} tier
 * @param {Adventure} adventure
 * @returns {string} the name of the dropped gear
 */
function rollGear(tier, adventure) {
	const pool = adventure.getElementPool().flatMap(element => LABYRINTHS[adventure.labyrinth].availableGear[element][tier]);
	return pool[adventure.generateRandomNumber(pool.length, "general")];
}

/** Internally decide the next boss of the given type, so scouting can provide that information
 * @param {"Final Battle" | "Artifact Guardian"} type
 * @param {Adventure} adventure
 */
function prerollBoss(type, adventure) {
	const roomPool = LABYRINTHS[adventure.labyrinth].availableRooms[type];
	const roomTitle = roomPool[adventure.generateRandomNumber(roomPool.length, "general")];
	if (type === "Artifact Guardian") {
		adventure.artifactGuardians.push(roomTitle);
	} else {
		adventure.bosses.push(roomTitle);
	}
}

/** Filters by type, then rolls a random room or returns the scouted room
 * @param {"Event" | "Battle" | "Merchant" | "Rest Site" | "Final Battle" | "Workshop" | "Artifact Guardian" | "Treasure" | "Empty"} type Room Types are internal tags that describe the contents of the room for randomization bucketing/UI generation purposes
 * @param {Adventure} adventure
 * @returns {RoomTemplate}
 */
function rollRoom(type, adventure) {
	if (type === "Artifact Guardian") {
		return getRoom(adventure.artifactGuardians[adventure.scouting.artifactGuardiansEncountered]);
	}

	if (type === "Final Battle") {
		return getRoom(adventure.bosses[adventure.scouting.bossesEncountered]);
	}

	if (!(type in LABYRINTHS[adventure.labyrinth].availableRooms)) {
		console.error("Attempt to create room of unidentified type: " + type);
		adventure.roomCandidates = { [`Battle${SAFE_DELIMITER}${adventure.depth}`]: { voterIds: [], isHidden: false } };
		return LABYRINTHS["Everything Bagel"].availableRooms["Empty"][0];
	}
	const roomPool = LABYRINTHS[adventure.labyrinth].availableRooms[type];
	const roomName = roomPool[adventure.generateRandomNumber(roomPool.length, "general")];
	if (ROOM_CATEGORIES.includes(roomName)) {
		return rollRoom(roomName, adventure);
	} else {
		return getRoom(roomName);
	}
}

module.exports = {
	labyrinthExists,
	/** This array determines which labyrinths show up in the `/delve labyrinth` autocomplete. It is desync'd from the list of all labyrinths to allow for easter eggs (ie remove Debug Dungeon after "real" labyrinths are made) */
	defaultLabyrinths: ["Mechahive", "Castle of the Celestial Knights", "Zoo of Chimeras", "Everything Bagel"],
	getLabyrinthProperty,
	rollItem,
	rollGear,
	prerollBoss,
	rollRoom
};
