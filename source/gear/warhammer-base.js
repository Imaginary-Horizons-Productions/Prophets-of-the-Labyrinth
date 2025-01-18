const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Warhammer",
	[
		["use", "Deal <@{damage} (+ @{awesomeBonus} if target is Stunned)> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Offense",
	"Darkness"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, awesomeBonus, critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		if (targets[0].isStunned) {
			pendingDamage += awesomeBonus;
		}
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}, { type: "single", team: "foe" })
	.setUpgrades("Fatiguing Warhammer", "Toxic Warhammer")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		awesomeBonus: 75
	});
