const { Archetype } = require("../classes");
// const { generateTextBar } = require("../../helpers.js");
// const { calculateTotalSpeed } = require("../combatantDAO.js");

module.exports = new Archetype("Martial Artist",
	"Able to assess combatant Stun thresholds and speed, the Martial Artist excels at stunning foes.",
	"Light",
	["Iron Fist Stance", "Floating Mist Stance"],
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return calculateTotalSpeed(second) - calculateTotalSpeed(first);
			});
		for (const combatant of activeCombatants) {
			const staggerCount = combatant.getModifierStacks("Stagger");
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}\nSpeed: ${calculateTotalSpeed(combatant)}` });
		}
		embed.setDescription("Combatants may act out of order if they have priority or they are tied in speed.");
		return [true, embed];
	},
	(combatant) => {
		const staggerCount = combatant.getModifierStacks("Stagger");
		return `Stagger: ${generateTextBar(staggerCount, combatant.staggerThreshold, combatant.staggerThreshold)}`;
	});
