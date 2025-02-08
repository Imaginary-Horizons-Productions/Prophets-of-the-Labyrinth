const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

const variantName = "Cleansing Water's Stillness";
module.exports = new GearTemplate(variantName,
	[
		["use", "Relieve Stagger and cure @{debuffsCured} random debuff for an ally and all allies with @{mod0}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [targetModifier], stagger, scalings: { debuffsCured, critBonus } } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
		let pendingStaggerRelief = stagger;
		if (user.essence === essence) {
			pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
		}
		if (user.crit) {
			pendingStaggerRelief *= critBonus;
		}
		changeStagger(allTargets, user, pendingStaggerRelief);
		const receipts = [];
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			const debuffsToRemove = Math.min(targetDebuffs.length, debuffsCured);
			for (let i = 0; i < debuffsToRemove; i++) {
				const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
				receipts.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
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
