const { ArchetypeTemplate } = require("../classes");
const { getModifierCategory } = require("../modifiers/_modifierDictionary");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Martial Artist",
	["Fencer", "Pugilist", "Deadeye", "Ninja"],
	"They'll be able to assess combatant how much Stagger to Stun each combatant and what moves enemies will be using this and next round. Their Flourish inflicts @e{Distraction} on their target.",
	"Darkness",
	(embed, adventure) => {
		embed.addFields({
			name: "Enemies",
			value: adventure.room.enemies.filter(combatant => combatant.hp > 0).map(enemy => {
				const move = adventure.room.findCombatantMove(enemy);
				return `${enemy.name}\n${enemy.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(enemy.stagger, enemy.getPoise(), enemy.getPoise())}`}\nRound ${adventure.room.round + 1} Move: ${move.name}\nRound ${adventure.room.round + 2} Move: ${enemy.nextAction}`;
			}).join("\n\n")
		})
		embed.addFields({
			name: "Delvers",
			value: adventure.delvers.map(delver => {
				return `${delver.name}\n${delver.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(delver.stagger, delver.getPoise(), delver.getPoise())}`}`;
			}).join("\n\n")
		})
		return embed.setDescription("Martial Artist predictions:");
	},
	(combatant) => {
		return `Has Debuffs: ${Object.keys(combatant.modifiers).some(modifier => getModifierCategory(modifier) === "Debuff") ? "✅" : "🚫"}`;
	},
	{
		base: "Flourish",
		Fencer: "Shattering Flourish",
		Pugilist: "Staggering Flourish",
		Deadeye: "Urgent Flourish",
		Ninja: "Bouncing Flourish"
	},
	["War Cry"],
	{
		maxHPGrowth: 50,
		powerGrowth: 5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25
	}
);
