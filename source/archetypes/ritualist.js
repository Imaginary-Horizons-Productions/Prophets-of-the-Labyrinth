const { ArchetypeTemplate } = require("../classes");
const { getModifierCategory } = require("../modifiers/_modifierDictionary");
const { modifiersToString } = require("../util/combatantUtil");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Ritualist",
	"They'll be able to assess combatant modifiers and how much Stagger to Stun them. They'll also be able to inflict great harm on foes suffering debuffs with their Censer.",
	"Fire",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	[],
	(embed, adventure) => {
		embed.addFields({
			name: "Enemies",
			value: adventure.room.enemies.filter(combatant => combatant.hp > 0).map(enemy => {
				const modifiersText = modifiersToString(enemy, adventure);
				return `${enemy.name}\n${enemy.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(enemy.stagger, enemy.getPoise(), enemy.getPoise())}`}\n${modifiersText ? `${modifiersText}` : "No buffs, debuffs, or states"}`;
			}).join("\n\n")
		})
		embed.addFields({
			name: "Delvers",
			value: adventure.delvers.map(delver => {
				const modifiersText = modifiersToString(delver, adventure);
				return `${delver.name}\n${delver.isStunned ? "💫 Stunned" : `Stagger: ${generateTextBar(delver.stagger, delver.getPoise(), delver.getPoise())}`}\n${modifiersText ? `${modifiersText}` : "No buffs, debuffs, or states"}`;
			}).join("\n\n")
		})
		return embed.setDescription(`Ritualist predictions for Round ${adventure.room.round}:`);
	},
	(combatant) => {
		return `Has Debuffs: ${Object.keys(combatant.modifiers).some(modifier => getModifierCategory(modifier) === "Debuff") ? "✅" : "🚫"}`;
	}
);
