const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Kinetic Net Launcher",
	[
		["use", "Inflict <@{damage} + @{bonusSpeed}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, modifiers: [torpidity] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower() + Math.max(0, user.getSpeed(true) - 100);
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, torpidity)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Staggering Net Launcher")
	.setCooldown(1)
	.setDamage(40)
	.setModifiers({ name: "Torpidity", stacks: 4 });
