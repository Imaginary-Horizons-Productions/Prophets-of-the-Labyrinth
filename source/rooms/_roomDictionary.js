const { RoomTemplate } = require("../classes");

/** @type {Record<string, RoomTemplate>} */
const ROOMS = {};

for (const file of [
	"artifactguardian-bruteconvention.js",
	"artifactguardian-celestialknightsunited.js",
	"artifactguardian-royalslime.js",
	"artifactguardian-treasureelemental.js",
	"battle-bloodtailhawks.js",
	"battle-frogranch.js",
	"battle-gaiaknightessandelegantstella.js",
	"battle-lunamilitissa.js",
	"battle-mechabees.js",
	"battle-meteorknight.js",
	"battle-slimes.js",
	"battle-spacedustcadet.js",
	"battle-starsandstripes.js",
	"battle-tortoises.js",
	"battle-wildfirearrowfrogs.js",
	"empty.js",
	"event-applepiewishingwell.js",
	"event-artifactdupe.js",
	"event-door1ordoor2.js",
	"event-freegoldonfire.js",
	"event-gearcollector.js",
	"event-impcontractfaire.js",
	"event-scorebeggar.js",
	"finalbattle-elkemist.js",
	"finalbattle-mechaqueenbee.js",
	"finalbattle-mechaqueenmech.js",
	"finalbattle-mirrors.js",
	"finalbattle-starryknight.js",
	"service-guildstop.js",
	"service-library.js",
	"service-merchant.js",
	"service-restsite.js",
	"service-workshop.js",
	"treasure-artifactvsgear.js",
	"treasure-artifactvsgold.js",
	"treasure-artifactvsitems.js",
	"treasure-gearvsitems.js",
	"treasure-goldvsgear.js",
	"treasure-goldvsitems.js",
]) {
	/** @type {RoomTemplate} */
	const room = require(`./${file}`);
	ROOMS[room.title] = room;
}

/** Room titles double as identifier for now, so must be unique
 * @param {string} roomTitle
 */
function getRoom(roomTitle) {
	return ROOMS[roomTitle];
}

module.exports = {
	getRoom,
	ROOM_CATEGORIES: ["Event", "Battle", "Merchant", "Rest Site", "Library", "Guildstop", "Final Battle", "Workshop", "Artifact Guardian", "Treasure", "Empty"]
};
