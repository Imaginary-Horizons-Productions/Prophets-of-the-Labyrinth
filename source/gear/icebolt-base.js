const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Ice Bolt",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	200,
	(targets, user, adventure) => {
		const { essence, damage, modifiers: [torpidity], critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, torpidity))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Awesome Ice Bolt", "Distracting Ice Bolt", "Numbing Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Torpidity", stacks: 2 })
	.setCharges(15);
