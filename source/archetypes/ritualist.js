const { ArchetypeTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { modifiersToString } = require("../util/combatantUtil");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Ritualist",
	"Able to divine the health and state of all combatants, the Ritualist punishes foes that dare play against destiny.",
	"Fire",
	["Censer", "Corrosion"],
	(embed, adventure) => {
		adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0).forEach(combatant => {
			const modifiersText = modifiersToString(combatant, false, adventure);
			embed.addFields({ name: combatant.getName(adventure.room.enemyIdMap), value: `${generateTextBar(combatant.hp, combatant.maxHP, 16)} ${combatant.hp}/${combatant.maxHP} HP${combatant.block ? `, ${combatant.block} Block` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		})
		return [false, embed];
	},
	(combatant) => {
		return `Has Debuffs: ${Object.keys(combatant.modifiers).some(modifier => isDebuff(modifier)) ? "✅" : "🚫"}`;
	}
);
