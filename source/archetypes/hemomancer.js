const { ArchetypeTemplate } = require("../classes");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Hemomancer",
	"They'll be able to predict the order combatants will act in and their how much Stagger to Stun them. They'll also be able to redirect enemy attacks with Blood Aegis.",
	"Darkness",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	["Life Drain", "Blood Aegis"],
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return second.getSpeed(true) - first.getSpeed(true);
			});
		for (const combatant of activeCombatants) {
			embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)}`, value: `${combatant.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(combatant.stagger, combatant.getPoise(), combatant.getPoise())}`}\nSpeed: ${combatant.getSpeed(true)}` });
		}
		embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
		return embed.setTitle(`Hemomancer Predictions for Round ${adventure.room.round + 1}`);
	},
	(combatant) => {
		if (combatant.isStunned) {
			return "💫 Stunned";
		} else {
			return `Stagger: ${generateTextBar(combatant.stagger, combatant.getPoise(), combatant.getPoise())}`;
		}
	}
);
