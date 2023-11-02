const { ArchetypeTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { modifiersToString } = require("../util/combatantUtil");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Ritualist",
	"They'll be able to assess combatant modifiers and hp levels. They'll also be able to inflict great harm on foes suffering debuffs with their Censer.",
	"Fire",
	["Censer", "Corrosion"],
	(embed, adventure) => {
		adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
			const modifiersText = modifiersToString(combatant, adventure);
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `${generateTextBar(combatant.hp, combatant.maxHP, 16)} ${combatant.hp}/${combatant.maxHP} HP${combatant.block ? `, ${combatant.block} Block` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		})
		return embed.setTitle(`Ritualist Predictions for Round ${adventure.room.round}`);
	},
	(combatant) => {
		return `Has Debuffs: ${Object.keys(combatant.modifiers).some(modifier => isDebuff(modifier)) ? "✅" : "🚫"}`;
	}
);
