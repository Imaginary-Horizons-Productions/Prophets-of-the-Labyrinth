const { ArchetypeTemplate } = require("../classes");
const { POTL_ICON_URL, ZERO_WIDTH_WHITESPACE } = require("../constants");
const { getCombatantCounters } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new ArchetypeTemplate("Detective",
	"They'll be able to assess combatant elemental affinities and random outcomes of moves. They'll also be able to induce weaknesses on foes with their Sabotage Kit.",
	"Unaligned",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Pistol", "Sabotage Kit"],
	(embed, adventure) => {
		/** @param {Combatant} combatant */
		function createElementField(combatant) {
			const weaknesses = getCombatantCounters(combatant);
			embed.addFields({ name: `${combatant.name} ${getEmoji(combatant.element)}`, value: `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}\nResistances: ${resistances.map(resistance => getEmoji(resistance)).join(" ")}`, inline: true });
		}
		// Separate Enemies and Delvers into different rows
		adventure.room.enemies.filter(combatant => combatant.hp > 0).forEach(createElementField);
		embed.addFields({ name: ZERO_WIDTH_WHITESPACE, value: ZERO_WIDTH_WHITESPACE });
		adventure.delvers.forEach(createElementField);
		if (adventure.room.detectivePredicts.length > 0) {
			embed.addFields({ name: "Random Outcomes", value: `- ${adventure.room.detectivePredicts.join("\n- ")}` });
		}
		return embed.setDescription(`Detective predictions for Round ${adventure.room.round}:`).setAuthor({ name: "Random outcomes from moves are predicted as if they are the first move to happen.", iconURL: POTL_ICON_URL });
	},
	(combatant) => {
		const weaknesses = getCombatantCounters(combatant);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
	}
);
