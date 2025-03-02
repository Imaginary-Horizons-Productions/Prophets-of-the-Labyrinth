const { ArchetypeTemplate } = require("../classes");
const { ICON_STAGGER, ICON_CANCEL, ICON_CONFIRM } = require("../constants");
const { getModifierCategory } = require("../modifiers/_modifierDictionary");
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
				const move = adventure.room.findCombatantMove(enemy);
				return `${enemy.name}\n${enemy.isStunned ? `${ICON_STAGGER} Stunned` : `Stagger: ${generateTextBar(enemy.stagger, enemy.getPoise(), enemy.getPoise())}`}\nRound ${adventure.room.round + 1} Move: ${move.name}\nRound ${adventure.room.round + 2} Move: ${enemy.nextAction}`;
			}).join("\n\n")
		})
		embed.addFields({
			name: "Delvers",
			value: adventure.delvers.map(delver => {
				return `${delver.name}\n${delver.isStunned ? `${ICON_STAGGER} Stunned` : `Stagger: ${generateTextBar(delver.stagger, delver.getPoise(), delver.getPoise())}`}`;
			}).join("\n\n")
		})
		return embed.setDescription("Martial Artist predictions:");
	},
	(combatant) => {
		return `Has Debuffs: ${Object.keys(combatant.modifiers).some(modifier => getModifierCategory(modifier) === "Debuff") ? ICON_CONFIRM : ICON_CANCEL}`;
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
