const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, removeModifier } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Disenchanting Lightning Staff",
	[
		["use", `Deal <@{damage}> @{essence} damage and remove @{buffRemovals} random buff from ${bounceCount} random foes`],
		["critical", "Damage x @{critBonus}"]
	],
	"Adventuring",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, buffRemovals } } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const receipts = [];
		for (const target of survivors) {
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			if (targetBuffs.length > 0) {
				for (let i = 0; i < buffRemovals; i++) {
					const [selectedBuff] = targetBuffs.splice(user.roundRns(`${module.exports.name}${SAFE_DELIMITER}buffs`), 1);
					receipts.push(...removeModifier([target], { name: selectedBuff, stacks: "all" }));
				}
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}, { type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setSidegrades("Hexing Lightning Staff")
	.setCooldown(2)
	.setRnConfig({ foes: 3, buffs: 1 })
	.setScalings({
		damage: { description: "50% Power", calculate: (user) => Math.floor(user.getPower() / 2) },
		critBonus: 2,
		buffRemovals: 1
	});
