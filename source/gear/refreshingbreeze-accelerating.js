const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { SAFE_DELIMITER } = require('../constants.js');

const gearName = "Accelerating Refreshing Breeze";
module.exports = new GearTemplate(gearName,
	[
		["use", "Cure a random debuff from each ally and grant them @{mod0Stacks} @{mod0}"],
		["Critical💥", "Debuffs cured x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [quicken] } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		const receipts = addModifier(targets, quicken);
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => isDebuff(modifier));
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
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Supportive Refreshing Breeze", "Swift Refreshing Breeze")
	.setModifiers({ name: "Quicken", stacks: 2 })
	.setDurability(15)
	.setRnConfig({ debuffs: 1 });
