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
		const totalResultLines = [];
		for (const target of targets) {
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			const removedBuffReceipts = []
			targetBuffs.forEach(buffName => {
				removedBuffReceipts.push(...removeModifier([target], { name: buffName, stacks: "all" }))
			})
			totalResultLines.push(...generateModifierResultLines(combineModifierReceipts(removedBuffReceipts)));

			const { essence, scalinge: { damage, critBonus } } = module.exports;
			let pendingDamage = damage.calculate(user) + 30 * targetBuffs.length;
			if (user.crit) {
				pendingDamage *= critBonus;
			}
			const { resultLines, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
			totalResultLines.push(...resultLines)
			if (user.essence === essence) {
				changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
			}
		}

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
