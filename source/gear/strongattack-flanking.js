const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Flanking Strong Attack",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Unaligned",
	350,
	(targets, user, adventure) => {
		const { damage, essence, critMultiplier, modifiers: [exposure] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, exposure)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Sharpened Strong Attack", "Staggering Strong Attack")
	.setModifiers({ name: "Exposure", stacks: 2 })
	.setCooldown(1)
	.setDamage(65);
