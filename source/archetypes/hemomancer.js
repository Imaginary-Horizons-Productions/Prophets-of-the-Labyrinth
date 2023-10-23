const { ArchetypeTemplate } = require("../classes");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Hemomancer",
	"They'll be able to predict the order combatants will act in and their how much Stagger to Stun them. They'll also be able to redirect enemy attacks with Blood Aegis.",
	"Darkness",
	["Life Drain", "Blood Aegis"],
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return second.getTotalSpeed() - first.getTotalSpeed();
			});
		for (const combatant of activeCombatants) {
			const staggerCount = combatant.getModifierStacks("Stagger");
			const isStunned = combatant.getModifierStacks("Stun") > 0;
			embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)}${isStunned ? " 💫" : ""}`, value: `Stagger: ${generateTextBar(staggerCount, combatant.poise, combatant.poise)}\nSpeed: ${combatant.getTotalSpeed()}` });
		}
		embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
		return embed.setTitle(`Hemomancer Predictions for Round ${adventure.room.round + 1}`);
	},
	(combatant) => {
		const staggerCount = combatant.getModifierStacks("Stagger");
		return `Stagger: ${generateTextBar(staggerCount, combatant.poise, combatant.poise)}`;
	}
);
