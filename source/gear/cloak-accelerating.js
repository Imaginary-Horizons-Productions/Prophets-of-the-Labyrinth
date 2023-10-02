const { GearTemplate } = require('../classes');
const { addModifier, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Cloak",
	"Gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}",
	"@{mod1} +@{bonus} and @{mod2} +@{bonus}",
	"Armor",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, evade, quicken], bonus } = module.exports;
		const pendingEvade = { ...evade, stacks: evade.stacks + (isCrit ? bonus : 0) };
		const pendingQuicken = { ...quicken, stacks: quicken.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		addModifier(user, pendingEvade);
		addModifier(user, pendingQuicken);
		return `${user.getName(adventure.room.enemyIdMap)} is prepared to Evade and Quickened.`;
	}
).setTargetingTags({ target: "self", team: "self" })
	.setSidegrades("Long Cloak", "Thick Cloak")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Quicken", stacks: 1 }])
	.setBonus(1) // Evade stacks
	.setDurability(15);
