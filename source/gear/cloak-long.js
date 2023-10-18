const { GearTemplate } = require('../classes');
const { addModifier, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Long Cloak",
	"Gain @{mod1Stacks} @{mod1}",
	"@{mod1} +@{bonus}",
	"Armor",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, evade], bonus } = module.exports;
		const pendingEvade = { ...evade, stacks: evade.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		addModifier(user, pendingEvade);
		return `${user.getName(adventure.room.enemyIdMap)} is prepared to Evade.`;
	}
).setTargetingTags({ target: "self", team: "any" })
	.setSidegrades("Accelerating Cloak", "Thick Cloak")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 3 })
	.setBonus(1) // Evade stacks
	.setDurability(15);
