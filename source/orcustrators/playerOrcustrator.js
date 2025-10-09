const fs = require("fs");
const { Player } = require("../classes");

const { getCompany, setCompany } = require("./companyOrcustrator");

const { ensuredPathSave } = require("../util/fileUtil.js");
const { getAllArchetypeNames } = require("../archetypes/_archetypeDictionary.js");
const { PET_NAMES } = require("../pets/_petDictionary.js");
const { extractFromRNTable, createRNTable } = require("../util/mathUtil.js");

const dirPath = "./saves"
const fileName = "players.json";
const filePath = `${dirPath}/${fileName}`;

const requirePath = "../../saves/players.json";
/** @type {Map<string, Player>} */
const playerDictionary = new Map();

async function loadPlayers() {
	if (fs.existsSync(filePath)) {
		const players = require(requirePath);
		players.forEach(player => {
			playerDictionary.set(player.id, player);
		})
		return `${players.length} players loaded`;
	} else {
		ensuredPathSave(dirPath, fileName, "[]");
		return "players regenerated";
	}
}

/**
 * @param {string} playerId
 * @param {string} guildId
 */
function getPlayer(playerId, guildId) {
	if (!playerDictionary.has(playerId)) {
		const rnTable = createRNTable(Date.now());
		let rnIndex = 0;
		const player = new Player(playerId);

		const archetypePool = getAllArchetypeNames();
		for (let i = 0; i < 3; i++) {
			const randomIndex = extractFromRNTable(rnTable, archetypePool.length, rnIndex);
			rnIndex = (rnIndex + 1) % rnTable.length;
			const [archetype] = archetypePool.splice(randomIndex, 1);
			player.archetypes[archetype] = { specializationsUnlocked: 1, highScore: 0 };
		}

		const petPool = [...PET_NAMES];
		const randomIndex = extractFromRNTable(rnTable, petPool.length, rnIndex);
		player.pets[petPool[randomIndex]] = 1;

		setPlayer(player);
		const company = getCompany(guildId);
		company.userIds.push(playerId);
		setCompany(company);
	}
	return playerDictionary.get(playerId);
}

/** @param {Player} player */
function setPlayer(player) {
	playerDictionary.set(player.id, player);
	ensuredPathSave("./Saves", "players.json", JSON.stringify(Array.from((playerDictionary.values()))));
}

/**
 * @param {string[]} userIds
 * @param {string} guildId
 */
function resetScores(userIds, guildId) {
	userIds.forEach(id => {
		const player = playerDictionary.get(id);
		player.scores[guildId] = { total: 0, high: 0 };
		setPlayer(player);
	})
}

module.exports = {
	loadPlayers,
	getPlayer,
	setPlayer,
	resetScores
};
