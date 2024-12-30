const { bold } = require("discord.js");
const { ArchetypeTemplate } = require("../classes");
const { listifyEN } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Knight",
	`They'll be able to predict who enemies are targeting with which moves. They'll gain deal extra damage scaling with their Speed with their Lance.`,
	"Light",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	[],
	(embed, adventure) => {
		const currentRoundLines = [];
		const nextRoundLines = [];
		adventure.room.moves.forEach(({ userReference, name, targets, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					if (name !== "Mirror Clone") {
						currentRoundLines.push(`${bold(enemy.name)}: ${name} (Targets: ${listifyEN(targets.map(targetReference => adventure.getCombatant(targetReference).name), false) || "none"}${priority != 0 ? `, Priority: ${priority}` : ""})`);
						nextRoundLines.push(`${bold(enemy.name)}: ${enemy.nextAction}`);
					} else {
						currentRoundLines.push(`${bold(enemy.name)}: Mimic ${adventure.delvers[userReference.index].name}`);
						nextRoundLines.push(`${bold(enemy.name)}: Mimic ${adventure.delvers[userReference.index].name}`);
					}
				}
			}
		})
		embed.addFields({ name: `Enemy Moves (Round ${adventure.room.round + 1})`, value: currentRoundLines.join("\n") });
		embed.addFields({ name: `Enemy Moves (Round ${adventure.room.round + 2})`, value: nextRoundLines.join("\n") });
		return embed.setDescription(`Knight predictions:`);
	},
	(combatant) => {
		if (combatant.team === "delver" || combatant.archetype === "Mirror Clone") {
			return "";
		} else {
			return `Move in 2 rounds: ${combatant.nextAction}`;
		}
	}
);
