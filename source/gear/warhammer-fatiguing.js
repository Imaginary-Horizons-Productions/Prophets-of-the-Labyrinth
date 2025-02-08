const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Fatiguing Warhammer",
	[
		["use", "Inflict <@{damage} (+ @{awesomeBonus} if target is Stunned)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Darkness"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, awesomeBonus, critBonus }, modifiers: [impotence] } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (targets[0].isStunned) {
			pendingDamage += awesomeBonus;
		}
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (survivors.length > 0) {
			if (user.essence === essence) {
				changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			resultLines.push(...generateModifierResultLines(addModifier(survivors, impotence)));
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Toxic Warhammer")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		awesomeBonus: 75
	})
	.setModifiers({ name: "Impotence", stacks: 2 });
