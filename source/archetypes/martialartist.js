const { ArchetypeTemplate } = require("../classes");
const { ICON_STAGGER } = require("../constants");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Martial Artist",
	["Fencer", "Pugilist", "Deadeye", "Ninja"],
	"A Martial Artist assess combatant how much Stagger to Stun each combatant and what moves enemies will be using this and next round.",
	"Their Flourish inflicts @e{Distraction} on their target.",
	"Darkness",
	(embed, adventure) => {
		embed.addFields({
			name: "Enemies",
			value: adventure.room.enemies.filter(combatant => combatant.hp > 0).map(enemy => {
				const move = adventure.room.findCombatantMove({ team: enemy.team, index: adventure.getCombatantIndex(enemy) });
				return `${enemy.name}\n${enemy.isStunned ? `${ICON_STAGGER} Stunned` : `Stagger: ${generateTextBar(enemy.stagger, enemy.getStaggerCap(), enemy.getStaggerCap())}`}\nRound ${adventure.room.round + 1} Move: ${move.name}\nRound ${adventure.room.round + 2} Move: ${enemy.nextAction}`;
			}).join("\n\n")
		})
		embed.addFields({
			name: "Delvers",
			value: adventure.delvers.map(delver => {
				return `${delver.name}\n${delver.isStunned ? `${ICON_STAGGER} Stunned` : `Stagger: ${generateTextBar(delver.stagger, delver.getStaggerCap(), delver.getStaggerCap())}`}`;
			}).join("\n\n")
		})
		return embed.setDescription("Martial Artist predictions:");
	},
	(combatant) => {
		return `Stagger: ${generateTextBar(combatant.stagger, combatant.getStaggerCap(), combatant.getStaggerCap())}`;
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
