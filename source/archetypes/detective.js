const { ArchetypeTemplate } = require("../classes");
const { POTL_ICON_URL } = require("../constants");
const { getCombatantWeaknesses, getNames } = require("../util/combatantUtil");
const { getEmoji, getResistances } = require("../util/elementUtil");

module.exports = new ArchetypeTemplate("Detective",
	"They'll be able to assess combatant elemental affinities and random outcomes of moves. They'll also be able to induce weaknesses on foes with their Sabotage Kit.",
	"Untyped",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Pistol", "Sabotage Kit"],
	(embed, adventure) => {
		const eligibleCombatants = adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers);
		const combatantNames = getNames(eligibleCombatants, adventure);
		eligibleCombatants.forEach((combatant, index) => {
			const weaknesses = getCombatantWeaknesses(combatant);
			const resistances = getResistances(combatant.element);
			embed.addFields({ name: `${combatantNames[index]} ${getEmoji(combatant.element)}`, value: `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}\nResistances: ${resistances.map(resistance => getEmoji(resistance)).join(" ")}` })
		});
		if (adventure.room.detectivePredicts.length > 0) {
			embed.addFields({ name: "Random Outcomes", value: `- ${adventure.room.detectivePredicts.join("\n- ")}` });
		}
		return embed.setTitle(`Detective Predictions for Round ${adventure.room.round}`).setAuthor({ name: "Random outcomes from moves are predicted as if they are the first move to happen.", iconURL: POTL_ICON_URL });
	},
	(combatant) => {
		const weaknesses = getCombatantWeaknesses(combatant);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
	}
);
