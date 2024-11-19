const { ensuredPathSave } = require("../../util/fileUtil");

const players = require("../../../saves/players.json");
players.forEach(player => {
	if (!("pets" in player)) {
		player.pets = {};
	}
	if (!("favoritePet" in player)) {
		player.favoritePet = "";
	}
	if (!("favoriteArchetype" in player)) {
		player.favoriteArchetype = "";
	}
})
ensuredPathSave("./Saves", "players.json", JSON.stringify(players));
