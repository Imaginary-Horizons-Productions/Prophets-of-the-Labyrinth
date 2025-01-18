const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

const variantName = "Cleansing Water's Stillness";
module.exports = new GearTemplate(variantName,
	[
		["use", "Relieve Stagger and cure @{debuffsCured} random debuff for an ally and all allies with @{mod0}"],
		["Critical💥", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [targetModifier], stagger, critMultiplier } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
		let pendingStaggerRelief = stagger;
		if (user.essence === essence) {
			pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
		}
		if (user.crit) {
			pendingStaggerRelief *= critMultiplier;
		}
		changeStagger(allTargets, user, pendingStaggerRelief);
		const receipts = [];
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			const debuffsToRemove = Math.min(targetDebuffs.length, user.crit ? 2 : 1);
			for (let i = 0; i < debuffsToRemove; i++) {
				const debuffIndex = user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][0] % targetDebuffs.length;
				const rolledDebuff = targetDebuffs[debuffIndex];
				const [removalReceipt] = removeModifier([target], { name: rolledDebuff, stacks: "all" });
				receipts.push(removalReceipt);
				if (removalReceipt.succeeded.size > 0) {
					targetDebuffs.splice(debuffIndex, 1);
				}
			}
		}
		return [joinAsStatement(false, allTargets.map(target => target.name), "shrugs off", "shrug off", "some Stagger.")].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}, { type: "single", team: "ally" })
	.setSidegrades("Accelerating Water's Stillness")
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 })
	.setScalings({
		debuffsCured: 1,
		critBonus: 2
	})
	.setRnConfig({ debuffs: 1 });
