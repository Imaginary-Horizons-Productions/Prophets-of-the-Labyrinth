const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Ice Bolt",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [slow], critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const slowedTargets = addModifier(targets, slow);
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed.")}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Awesome Ice Bolt", "Distracting Ice Bolt", "Unlucky Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDurability(15);
