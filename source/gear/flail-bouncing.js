const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const bounceCount = "3";
module.exports = new GearTemplate("Bouncing Flail",
	[
		["use", `Inflict <@{damage}> @{essence} damage on ${bounceCount} random foes`],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Offense",
	"Earth"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, stagger } = module.exports;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		changeStagger(targets, user, pendingStagger);
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure)
			.concat(joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered."));
	}, { type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setSidegrades("Incompatible Flail")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(20),
		critBonus: 2
	})
	.setStagger(2);
