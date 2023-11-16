const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Cloak",
	"Gain @{critRate} Crit Rate; gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} when used in combat",
	"@{mod0} +@{bonus} and @{mod1} +@{bonus}",
	"Armor",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [evade, quicken], bonus } = module.exports;
		const pendingEvade = { ...evade, stacks: evade.stacks + (isCrit ? bonus : 0) };
		const pendingQuicken = { ...quicken, stacks: quicken.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		addModifier(user, pendingEvade);
		addModifier(user, pendingQuicken);
		return `${user.getName(adventure.room.enemyIdMap)} is prepared to Evade and Quickened.`;
	}
).setTargetingTags({ target: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Long Cloak", "Thick Cloak")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Quicken", stacks: 1 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setDurability(15);
