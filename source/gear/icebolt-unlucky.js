const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Unlucky Ice Bolt",
	[
		["use", "Inflict @{damage} @{element} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [slow, unlucky], critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const slowedTargets = addModifier(targets, slow);
		if (slowedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed."));
		}
		const unluckyTargets = addModifier(targets, unlucky);
		if (unluckyTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(unluckyTargets, adventure), "becomes", "become", "Unlucky."));
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Awesome Ice Bolt", "Distracting Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "Unlucky", stacks: 1 })
	.setDurability(15);
