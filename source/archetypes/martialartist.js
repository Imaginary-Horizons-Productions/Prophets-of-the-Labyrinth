const { ArchetypeTemplate } = require("../classes");
const { getNames } = require("../util/combatantUtil");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Martial Artist",
	"They'll be able to predict the order combatants will act in and their how much Stagger to Stun them. They'll also be able enhance their Punches with various stances.",
	"Light",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	["Iron Fist Stance", "Floating Mist Stance"],
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return second.getSpeed(true) - first.getSpeed(true);
			});
		const combatantNames = getNames(activeCombatants, adventure);
		activeCombatants.forEach((combatant, index) => {
			embed.addFields({ name: combatantNames[index], value: `${combatant.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(combatant.stagger, combatant.getPoise(), combatant.getPoise())}`}\nSpeed: ${combatant.getSpeed(true)}` });
		})
		embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
		return embed.setTitle(`Martial Artist Predictions for Round ${adventure.room.round + 1}`);
	},
	(combatant) => {
		if (combatant.isStunned) {
			return "💫 Stunned";
		} else {
			return `Stagger: ${generateTextBar(combatant.stagger, combatant.getPoise(), combatant.getPoise())}`;
		}
	}
);
