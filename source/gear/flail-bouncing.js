const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const bounces = 3;
module.exports = new GearTemplate("Bouncing Flail",
	[
		["use", "Inflict <@{damage}> @{essence} damage on @{bounces} random foes"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(350)
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
	}, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setSidegrades("Incompatible Flail")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(20),
		critBonus: 2,
		bounces
	})
	.setRnConfig({ foes: bounces })
	.setStagger(2);
