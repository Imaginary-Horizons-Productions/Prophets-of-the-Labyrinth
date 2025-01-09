const { ArchetypeTemplate } = require("../classes");
const { listifyEN } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Knight",
	["Templar", "Paladin", "General", "Juggernaut"],
	"They'll be able to predict who enemies are targeting with which moves and the order combatants will act in. Their Lance will grant them protection.",
	"Water",
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => second.getSpeed(true) - first.getSpeed(true));
		activeCombatants.forEach(combatant => {
			const move = adventure.room.findCombatantMove({ team: combatant.team, index: adventure.getCombatantIndex(combatant) });
			if (move?.name === "Mirror Clone") {
				embed.addFields({ name: combatant.name, value: `Move: Mimic ${adventure.delvers[move.userReference.index].name} Speed: ${combatant.getSpeed(true)}` });
			} else if (move) {
				embed.addFields({ name: combatant.name, value: `Move: ${move.name} (Targets: ${listifyEN(targets.map(targetReference => adventure.getCombatant(targetReference).name), false) || "none"})\nSpeed: ${combatant.getSpeed(true)}${priority > 0 ? ` (Priority ${priority})` : ""}` });
			} else {
				// Missing move because delver hasn't decided yet
				embed.addFields({ name: combatant.name, value: `Speed: ${combatant.getSpeed(true)}` });
			}
		});
		return embed.setDescription(`Knight predictions for Round ${adventure.room.round + 1}:`);
	},
	(combatant) => {
		return `Speed: ${combatant.getSpeed(true)}`;
	},
	{
		base: "Lance",
		General: "Bashing Lance",
		Templar: "Taunting Lance",
		Paladin: "Accelerating Lance",
		Juggernaut: "Juggernaut's Lance"
	},
	["Buckler"],
	{
		maxHPGrowth: 50,
		powerGrowth: 2.5,
		speedGrowth: 1,
		critRateGrowth: 0.25
	}
);
