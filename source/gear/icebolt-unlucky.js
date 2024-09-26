const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
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
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const slowedTargets = addModifier(targets, slow);
		if (slowedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, slowedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Slow")}.`));
		}
		const unluckyTargets = addModifier(targets, unlucky);
		if (unluckyTargets.length > 0) {
			resultLines.push(joinAsStatement(false, unluckyTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Unlucky")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Awesome Ice Bolt", "Distracting Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "Unlucky", stacks: 1 })
	.setDurability(15);
