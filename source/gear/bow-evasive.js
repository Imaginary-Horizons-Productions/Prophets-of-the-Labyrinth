const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Bow",
	[
		["use", "Strike a foe for @{damage} @{element} damage and gain @{mod0Stacks} @{mod0} with priority"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(addModifier([user], evade)));
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Thief's Bow", "Unstoppable Bow")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setDurability(15)
	.setDamage(40)
	.setPriority(1);
