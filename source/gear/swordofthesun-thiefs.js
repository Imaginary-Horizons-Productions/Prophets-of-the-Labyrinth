const { GearTemplate } = require('../classes');
const { damageScalingGenerator } = require('./shared/scalings');
const base = require('./swordofthesun-base');

module.exports = new GearTemplate("Thief's Sword of the Sun",
	[
		["use", "Removes all buffs from a foe, then deal <@{damage} + 30 per unique buff removed> @{essence} damage to a them, then gain @{bounty}g if they're downed."],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(450)
	.setEffect((targets, user, adventure) => {
		const totalResultLines = base.effect(targets, user, adventure, module.exports.scalings);
		const { bounty } = module.exports.scalings
		if (targets.find(t => t.hp <= 0) !== undefined) {
			adventure.room.addResource("Gold", "Currency", "loot", bounty);
			totalResultLines.push(`${user.name} pillages ${bounty}g.`);
		}
		return totalResultLines
	}, base.targetingTags)
	.setSidegrades("Lethal Sword of the Sun")
	.setCooldown(3)
	.setFlavorText("This is a habit, isn't it?")
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		bounty: 30
	});
