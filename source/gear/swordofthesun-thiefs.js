const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, changeStagger, combineModifierReceipts, removeModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Thief's Sword of the Sun",
	[
		["use", "Removes all buffs from a foe, then deal <@{damage}> @{essence} damage to a them, plus 30 damage per unique buff removed, then gain @{bounty}g if they're downed. This is a habit, isn't it?"],
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

			const { essence, scalings: { damage, critBonus, bounty } } = module.exports;
			let pendingDamage = damage.calculate(user) + 30 * targetBuffs.length;
			if (user.crit) {
				pendingDamage *= critBonus;
			}
			const { resultLines, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
			totalResultLines.push(...resultLines)
			if (user.essence === essence) {
				changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			if (survivors.length < 1) {
				adventure.room.addResource("Gold", "Currency", "loot", bounty);
				totalResultLines.push(`${user.name} pillages ${bounty}g.`);
			}
		}
		return totalResultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Lethal Sword of the Sun")
	.setCooldown(3)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		bounty: 30
	});
