const { GearTemplate } = require('../classes');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');
const { swiftPassive } = require('./descriptions/passives');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');

const gearName = "Swift Refreshing Breeze";
module.exports = new GearTemplate(gearName,
	[
		swiftPassive,
		["use", "Cure a random debuff from each ally"],
		["Critical💥", "Debuffs cured x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element } = module.exports;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		const receipts = [];
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			if (targetDebuffs.length > 0) {
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
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setSidegrades("Accelerating Refreshing Breeze", "Supportive Refreshing Breeze")
	.setCharges(15)
	.setSpeed(2)
	.setRnConfig({ debuffs: 1 });
