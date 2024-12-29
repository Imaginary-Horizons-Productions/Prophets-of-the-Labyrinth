const { ensuredPathSave } = require("../../util/fileUtil");

const players = require("../../../saves/players.json");
const { rollPets } = require("../../pets/_petDictionary");
players.forEach(player => {
	if (!("pets" in player)) {
		player.pets = {};
	}
	if (Object.keys(player.pets).length < 1) {
		rollPets(1, false).forEach(pet => {
			player.pets[pet] = 1;
		})
	}
	if (!("favoritePet" in player)) {
		player.favoritePet = "";
	}
	if (!("favoriteArchetype" in player)) {
		player.favoriteArchetype = "";
	}
})
ensuredPathSave("./Saves", "players.json", JSON.stringify(players));
