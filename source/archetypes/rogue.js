const { ArchetypeTemplate, Combatant } = require("../classes");
const { ZERO_WIDTH_WHITESPACE, ICON_CRITICAL, ICON_CANCEL } = require("../constants");
const { getCombatantCounters } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ArchetypeTemplate("Rogue",
	["Assassin", "Acrobat", "Charlatan", "Juggler"],
	"A Rogue can predict which combatants will critically hit and which essence to use to counter each combatant.",
	"Their Daggers gives them @e{Excellence}.",
	"Fire",
	(embed, adventure) => {
		/** @param {Combatant} combatant */
		function createEssenceAndCritField(combatant) {
			const counters = getCombatantCounters(combatant);
			embed.addFields({ name: `${combatant.name} ${getEmoji(combatant.essence)}`, value: `Critical: ${combatant.crit ? ICON_CRITICAL : ICON_CANCEL}\nCounters: ${counters.map(counter => getEmoji(counter)).join(" ")}`, inline: true });
		}
		// Separate Enemies and Delvers into different rows
		adventure.room.enemies.filter(combatant => combatant.hp > 0).forEach(createEssenceAndCritField);
		embed.addFields({ name: ZERO_WIDTH_WHITESPACE, value: ZERO_WIDTH_WHITESPACE });
		adventure.delvers.forEach(createEssenceAndCritField);
		return embed.setDescription(`Assassin predictions for Round ${adventure.room.round}:`);
	},
	(combatant) => {
		const counters = getCombatantCounters(combatant);
		return `Counters: ${counters.map(counter => getEmoji(counter)).join(" ")}`;
	},
	{
		base: "Daggers",
		Assassin: "Attuned Daggers",
		Acrobat: "Balanced Daggers",
		Charlatan: "Distracting Daggers",
		Juggler: "Centering Daggers"
	},
	["Parrying Dagger"],
	{
		maxHPGrowth: 25,
		powerGrowth: 5,
		speedGrowth: 0.5,
		critRateGrowth: 0.5
	}
);
