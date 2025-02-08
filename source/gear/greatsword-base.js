const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Greatsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and their adjacent allies"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Wind"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus } } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines;
	}, { type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setUpgrades("Chaining Greatsword", "Distracting Greatsword")
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});
