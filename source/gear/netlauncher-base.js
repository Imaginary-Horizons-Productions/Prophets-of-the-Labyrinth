const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Net Launcher",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Water",
	200,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, modifiers: [torpidity] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, torpidity)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Kinetic Net Launcher", "Staggering Net Launcher")
	.setCooldown(1)
	.setDamage(40)
	.setModifiers({ name: "Torpidity", stacks: 4 });
