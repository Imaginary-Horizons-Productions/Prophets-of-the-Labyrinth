const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, changeStagger, combineModifierReceipts, removeModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Sword of the Sun",
	[
		["use", "Removes all buffs from a foe, then deal <@{damage} + 30 per unique buff removed> @{essence} damage to a them"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(300)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus } } = module.exports;
		const totalResultLines = [];
		for (const target of targets) {
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			const removedBuffReceipts = []
			targetBuffs.forEach(buffName => {
				removedBuffReceipts.push(...removeModifier([target], { name: buffName, stacks: "all" }))
			})
			totalResultLines.push(...generateModifierResultLines(combineModifierReceipts(removedBuffReceipts)));

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

		return totalResultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Thief's Sword of the Sun", "Lethal Sword of the Sun")
	.setCooldown(3)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});
