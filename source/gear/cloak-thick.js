const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thick Cloak",
	"Gain @{mod0Stacks} @{mod0}",
	"@{mod0} +@{bonus}",
	"Armor",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [evade], bonus } = module.exports;
		const pendingEvade = { ...evade, stacks: evade.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		addModifier(user, pendingEvade);
		return `${user.getName(adventure.room.enemyIdMap)} is prepared to Evade.`;
	}
).setTargetingTags({ target: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Accelerating Cloak", "Long Cloak")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setBonus(1) // Evade stacks
	.setDurability(30);
