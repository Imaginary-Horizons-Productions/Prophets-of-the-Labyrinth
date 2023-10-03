const fs = require("fs");
const { Player } = require("../classes");

const { getCompany, setCompany } = require("./companyOrcustrator");

const { ensuredPathSave } = require("../util/fileUtil.js");

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
		setPlayer(new Player(playerId));
		let guildProfile = getCompany(guildId);
		guildProfile.userIds.push(playerId);
		setCompany(guildProfile);
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
