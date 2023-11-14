const { ArchetypeTemplate } = require("../classes");
const { modifiersToString } = require("../util/combatantUtil.js");
const { generateTextBar } = require("../util/textUtil.js");

module.exports = new ArchetypeTemplate("Chemist",
	"They'll be able to assess combatant modifiers and hp levels. They'll also be able to make items with their Potion Kit.",
	"Water",
	["Sickle", "Potion Kit"],
	(embed, adventure) => {
		adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
			const modifiersText = modifiersToString(combatant, adventure);
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `${generateTextBar(combatant.hp, combatant.getMaxHP(), 16)} ${combatant.hp}/${combatant.getMaxHP()} HP${combatant.block ? `, ${combatant.block} Block` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		})
		return embed.setTitle(`Chemist Predictions for Round ${adventure.room.round}`);
	},
	(combatant) => {
		return `HP: ${combatant.hp}/${combatant.getMaxHP()}`;
	}
);
