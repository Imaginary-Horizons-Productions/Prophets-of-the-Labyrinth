const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Cloak",
	"Gain @{critRate} Crit Rate; gain @{mod0Stacks} @{mod0} when used in combat",
	"@{mod0} +@{bonus}",
	"Armor",
	"Wind",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade], bonus } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingEvade.stacks += bonus;
		}
		const addedEvade = addModifier(user, pendingEvade);
		if (addedEvade) {
			return `${user.getName(adventure.room.enemyIdMap)} is prepared to Evade.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setUpgrades("Accelerating Cloak", "Accurate Cloak", "Long Cloak")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setDurability(15);
