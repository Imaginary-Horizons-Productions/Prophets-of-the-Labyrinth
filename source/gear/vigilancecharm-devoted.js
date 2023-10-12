const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Devoted Vigilance Charm",
	"Grant an ally @{mod1Stacks} @{mod1}",
	"@{mod1} +@{bonus}",
	"Trinket",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, vigilance], bonus } = module.exports;
		const pendingVigilance = { ...vigilance, stacks: vigilance.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		addModifier(target, pendingVigilance);
		return `${target.getName(adventure.room.enemyIdMap)} gains Vigilance.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Long Vigilance Charm", "Reinforced Vigilance Charm")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 3 })
	.setBonus(2) // Vigilance stacks
	.setDurability(15);
