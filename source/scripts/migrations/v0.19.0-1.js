const { ensuredPathSave } = require("../../util/fileUtil");

const players = require("../../../saves/players.json");
players.forEach(player => {
	if (!("bonusDrafts" in player)) {
		player.bonusDrafts = 0;
	}
	if (!("guildInfluence" in player)) {
		player.guildInfluence = 0;
	}
	if (!("draftCount" in player)) {
		player.draftCount = 0;
	}
})
ensuredPathSave("./Saves", "players.json", JSON.stringify(players));
