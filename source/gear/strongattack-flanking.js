const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Flanking Strong Attack",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { damage, element, critMultiplier, modifiers: [exposed] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedExposed = addModifier(targets, exposed).length > 0;
		if (addedExposed) {
			resultLines.push(joinAsStatement(false, getNames(targets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Exposed")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Strong Attack", "Staggering Strong Attack")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(65);
