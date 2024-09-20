const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Accelerating Lance",
	[
		["use", "Strike a foe for @{damage} @{element} damage (double increase from @{mod1}), then gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [quicken], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedQuicken = addModifier([user], quicken).length > 0;
		if (addedQuicken) {
			resultLines.push(`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Quickened")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Shattering Lance", "Unstoppable Lance")
	.setModifiers({ name: "Quicken", stacks: 1 }, { name: "Power Up", stacks: 0 })
	.setDurability(15)
	.setDamage(40);
