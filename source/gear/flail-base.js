const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Flail",
	[
		["use", "Inflict <@{damage}> @{essence} damage on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, stagger } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (survivors.length > 0) {
			changeStagger(survivors, user, pendingStagger);
			resultLines.push(joinAsStatement(false, survivors.map(target => target.name), "is", "are", "Staggered."));
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Bouncing Flail", "Incompatible Flail")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setStagger(2);
