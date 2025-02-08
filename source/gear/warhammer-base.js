const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Warhammer",
	[
		["use", "Deal <@{damage} (+ @{awesomeBonus} if target is Stunned)> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Darkness"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, awesomeBonus, critBonus } } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (targets[0].isStunned) {
			pendingDamage += awesomeBonus;
		}
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Fatiguing Warhammer", "Toxic Warhammer")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		awesomeBonus: 75
	});
