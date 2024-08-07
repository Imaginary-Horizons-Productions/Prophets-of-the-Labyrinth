const { GearTemplate } = require('../classes/index.js');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accurate Cloak",
	"Gain @{mod0Stacks} @{mod0}. Passive: Gain @{critRate} Crit Rate",
	"@{mod0} +@{bonus}",
	"Armor",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade], bonus } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingEvade.stacks += bonus;
		}
		const addedEvade = addModifier([user], pendingEvade).length > 0;
		if (addedEvade) {
			return `${getNames([user], adventure)[0]} is prepared to Evade.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Accelerating Cloak", "Long Cloak")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setBonus(1) // Evade stacks
	.setCritRate(10)
	.setDurability(15);
