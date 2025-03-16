const { GearTemplate } = require('../classes');
const { damageScalingGenerator } = require('./shared/scalings');
const base = require('./swordofthesun-base');

module.exports = new GearTemplate("Lethal Sword of the Sun",
	[
		["use", "Removes all buffs from a foe, then deal <@{damage} + 30 per unique buff removed> @{essence} damage to a them"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(450)
	.setEffect((targets, user, adventure) => base.effect(targets, user, adventure, module.exports.scalings), base.targetingTags)
	.setSidegrades("Thief's Sword of the Sun")
	.setCooldown(3)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 3
	});
