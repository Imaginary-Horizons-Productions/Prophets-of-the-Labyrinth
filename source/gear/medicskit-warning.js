const { GearTemplate } = require('../classes/index.js');
const { getModifierCategory } = require('../modifiers/_modifierDictionary.js');
const { removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines, addModifier } = require('../util/combatantUtil.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');

const gearName = "Warning Medic's Kit";
module.exports = new GearTemplate(gearName,
	[
		["use", "Cure a random debuff and grant @{mod0Stacks} @{mod0} to each ally"],
		["Critical💥", "Debuffs cured x@{critMultiplier}"]
	],
	"Support",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [evasion] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const receipts = addModifier(targets, evasion);
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			const debuffsToRemove = Math.min(targetDebuffs.length, user.crit ? 2 : 1);
			for (let i = 0; i < debuffsToRemove; i++) {
				const debuffIndex = user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][0] % targetDebuffs.length;
				const rolledDebuff = targetDebuffs[debuffIndex];
				const [removalReceipt] = removeModifier([target], { name: rolledDebuff, stacks: "all" });
				receipts.push(removalReceipt);
				if (removalReceipt.succeeded.size > 0) {
					targetDebuffs.splice(debuffIndex, 1);
				}
			}
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setSidegrades("Inspiring Medic's Kit")
	.setCooldown(2)
	.setRnConfig({ debuffs: 1 })
	.setModifiers({ name: "Evasion", stacks: 1 });
