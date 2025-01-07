const { ensuredPathSave } = require("../../util/fileUtil");

const players = require("../../../saves/players.json");
players.forEach(player => {
	const renames = {
		"Assassin": "Rogue",
		"Fighter": "Adventurer",
		"Legionnaire": "Tactician",
		"Detective": "Bard"
	};
	const migratedArchetypeMap = {};
	for (const archetype in player.archetypes) {
		if (typeof player.archetypes[archetype] === "number") {
			if (["Ritualist", "Hemomancer"].includes(archetype)) {
				migratedArchetypeMap.Ritualist = { specializationsUnlocked: 1, highScore: Math.max(player.archetypes.Ritualist, player.archetypes.Hemomancer) };
			} else if (archetype in renames) {
				migratedArchetypeMap[renames[archetype]] = { specializationsUnlocked: 1, highScore: player.archetypes[archetype] };
			} else {
				migratedArchetypeMap[archetype] = { specializationsUnlocked: 1, highScore: player.archetypes[archetype] };
			}
		}
	}
	if (Object.keys(migratedArchetypeMap).length > 0) {
		player.archetypes = migratedArchetypeMap;
	}
	if (player.favoriteArchetype in renames) {
		player.favoriteArchetype = renames[player.favoriteArchetype];
	}
})
ensuredPathSave("./Saves", "players.json", JSON.stringify(players));
