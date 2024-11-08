const { ensuredPathSave } = require("../../util/fileUtil");

const players = require("../../../saves/players.json");
players.forEach(player => {
	player.pets = {};
	player.favoritePet = "";
})
ensuredPathSave("./Saves", "players.json", JSON.stringify(players));
