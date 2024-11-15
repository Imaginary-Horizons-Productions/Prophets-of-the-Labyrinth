const { italic } = require("discord.js");
const { ArchetypeTemplate } = require("../classes");
const { ZERO_WIDTH_WHITESPACE } = require("../constants");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Martial Artist",
	"They'll be able to predict enemy moves in two rounds and how much Stagger it'll take to Stun them. They'll also be able enhance their Punches with various stances.",
	"Light",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Iron Fist Stance", "Floating Mist Stance"],
	(embed, adventure) => {
		adventure.room.enemies.filter(enemy => enemy.hp > 0).forEach(combatant => {
			embed.addFields({ name: combatant.name, value: `${combatant.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(combatant.stagger, combatant.getPoise(), combatant.getPoise())}`}\nRound ${adventure.room.round + 2} Move: ${italic(combatant.nextAction)}`, inline: true });
		});
		embed.addFields({ name: ZERO_WIDTH_WHITESPACE, value: ZERO_WIDTH_WHITESPACE });
		adventure.delvers.forEach(combatant => {
			embed.addFields({ name: combatant.name, value: `${combatant.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(combatant.stagger, combatant.getPoise(), combatant.getPoise())}`}`, inline: true });
		});
		return embed.setDescription(`Martial Artist predictions:`);
	},
	(combatant) => {
		if (combatant.isStunned) {
			return "💫 Stunned";
		} else {
			return `Stagger: ${generateTextBar(combatant.stagger, combatant.getPoise(), combatant.getPoise())}`;
		}
	}
);
