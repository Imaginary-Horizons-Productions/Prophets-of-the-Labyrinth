const { ArchetypeTemplate } = require("../classes/ArchetypeTemplate.js");
const { modifiersToString } = require("../util/combatantUtil.js");
const { generateTextBar } = require("../util/textUtil.js");

module.exports = new ArchetypeTemplate("Chemist",
	"Able to and assess combatant modifiers and hp levels, the Chemist excels at managing party and enemy health.",
	"Water",
	["Sickle", "Potion Kit"],
	(embed, adventure) => {
		adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
			const modifiersText = modifiersToString(combatant, false, adventure);
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `${generateTextBar(combatant.hp, combatant.maxHp, 16)} ${combatant.hp}/${combatant.maxHp} HP${combatant.block ? `, ${combatant.block} Block` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		})
		return [false, embed];
	},
	(combatant) => {
		return `HP: ${combatant.hp}/${combatant.maxHp}`;
	});
