const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Cloak",
	"Gain @{critRate} Crit Rate; gain @{mod0Stacks} @{mod0} when used in combat",
	"@{mod0} +@{bonus}",
	"Armor",
	"Wind",
	200,
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
	.setUpgrades("Accelerating Cloak", "Accurate Cloak", "Long Cloak")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setDurability(15);
