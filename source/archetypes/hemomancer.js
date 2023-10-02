const { ArchetypeTemplate } = require("../classes");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Hemomancer",
	"Able to predict the order combatants will act and their Stun thresholds, the Hemomancer excels at getting the last word.",
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
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}\nSpeed: ${combatant.getTotalSpeed()}` });
		}
		embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
		return [true, embed];
	},
	(combatant) => {
		const staggerCount = combatant.getModifierStacks("Stagger");
		return `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}`;
	});
