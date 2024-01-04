const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Cloak",
	"Gain @{critRate} Crit Rate; gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} when used in combat",
	"@{mod0} +@{bonus} and @{mod1} +@{bonus}",
	"Armor",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, quicken], bonus } = module.exports;
		const pendingEvade = { ...evade };
		const pendingQuicken = { ...quicken };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingEvade.stacks += bonus;
			pendingQuicken.stacks += bonus;
		}
		const addedEvade = addModifier(user, pendingEvade);
		const addedQuicken = addModifier(user, pendingQuicken);
		if (addedEvade) {
			return `${user.getName(adventure.room.enemyIdMap)} is prepared to Evade and Quickened.`;
		} else if (addedQuicken) {
			return `${user.getName(adventure.room.enemyIdMap)} is Quickened.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Accurate Cloak", "Long Cloak")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Quicken", stacks: 1 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setDurability(15);
