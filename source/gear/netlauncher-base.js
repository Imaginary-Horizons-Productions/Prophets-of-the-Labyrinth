const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Offense",
	"Water"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [torpidity] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, torpidity)));
	}, { type: "single", team: "foe" })
	.setUpgrades("Kinetic Net Launcher", "Staggering Net Launcher")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Torpidity", stacks: 4 });
