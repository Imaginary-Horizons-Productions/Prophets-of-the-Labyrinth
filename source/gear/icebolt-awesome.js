const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Awesome Ice Bolt",
	[
		["use", "Inflict @{damage} @{element} damage (+@{bonus} if foe is stunned) and @{mod0Stacks} @{mod0} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [slow], critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let stunnedDamage = pendingDamage + bonus;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
			stunnedDamage *= critMultiplier;
		}
		const resultLines = [];
		targets.forEach(target => resultLines.push(...dealDamage([target], user, target.isStunned ? stunnedDamage : pendingDamage, false, element, adventure)));
		const slowedTargets = addModifier(targets, slow);
		if (slowedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, getNames(slowedTargets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Slow")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Ice Bolt", "Unlucky Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDurability(15)
	.setBonus(75);
