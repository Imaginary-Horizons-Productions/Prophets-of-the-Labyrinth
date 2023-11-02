const { ArchetypeTemplate } = require("../classes");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Martial Artist",
	"They'll be able to predict the order combatants will act in and their how much Stagger to Stun them. They'll also be able enhance their Punches with various stances.",
	"Light",
	["Iron Fist Stance", "Floating Mist Stance"],
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return second.getTotalSpeed() - first.getTotalSpeed();
			});
		for (const combatant of activeCombatants) {
			embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)}${combatant.isStunned ? " 💫" : ""}`, value: `Stagger: ${generateTextBar(combatant.stagger, combatant.poise, combatant.poise)}\nSpeed: ${combatant.getTotalSpeed()}` });
		}
		embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
		return embed.setTitle(`Martial Artist Predictions for Round ${adventure.room.round + 1}`);
	},
	(combatant) => {
		return `Stagger: ${generateTextBar(combatant.stagger, combatant.poise, combatant.poise)}`;
	}
);
