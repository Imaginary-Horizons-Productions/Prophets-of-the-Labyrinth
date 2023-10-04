const { GearTemplate } = require('../classes');
const { addModifier, removeModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Long Vigilance Charm",
	"Gain @{mod1Stacks} @{mod1}",
	"@{mod1} +@{bonus}",
	"Trinket",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, vigilance], bonus } = module.exports;
		const pendingVigilance = { ...vigilance, stacks: vigilance.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		addModifier(user, pendingVigilance);
		return `${user.getName(adventure.room.enemyIdMap)} gains Vigilance.`;
	}
).setTargetingTags({ target: "self", team: "self" })
	.setSidegrades("Devoted Vigilance Charm", "Reinforced Vigilance Charm")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 4 }])
	.setBonus(2) // Vigilance stacks
	.setDurability(15);
