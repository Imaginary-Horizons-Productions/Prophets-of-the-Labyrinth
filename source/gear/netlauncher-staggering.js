const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Staggering Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Water"
).setCost(350)
	.setEffect(
		(targets, user, adventure) => {
			const { essence, scalings: { damage, critBonus }, modifiers: [torpidity], stagger } = module.exports;
			let pendingStagger = stagger;
			if (user.essence === essence) {
				pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
			}
			changeStagger(targets, user, pendingStagger);
			let pendingDamage = damage.calculate(user);
			if (user.crit) {
				pendingDamage *= critBonus;
			}
			return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, torpidity)));
		}, { type: "single", team: "foe" })
	.setSidegrades("Kinetic Net Launcher")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Torpidity", stacks: 4 })
	.setStagger(2);
