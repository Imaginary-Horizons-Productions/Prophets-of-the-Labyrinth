const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Slowing Daggers",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const slowedTargets = addModifier(targets, slow);
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${addedSlow ? ` ${joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Daggers", "Sweeping Daggers")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setDurability(15)
	.setCritMultiplier(3)
	.setDamage(40);
