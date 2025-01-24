const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier, removeModifier } = require('../util/combatantUtil');

const variantName = "Tormenting Universal Solution";
const debuffsTransferred = 2;
const poisonStacks = 3;
module.exports = new GearTemplate(variantName,
	[
		["use", "Transfer a random @{debuffsTransferred} of your debuffs to a foe then add @{debuffIncrement} stack to each of their debuffs"],
		["Critical💥", "Transfer all of your debuffs"]
	],
	"Pact",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { debuffsTransferred, debuffIncrement }, modifiers: [poison] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const receipts = [];
		if (user.crit) {
			for (const debuff of userDebuffs) {
				receipts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				receipts.push(...removeModifier([user], { name: debuff, stacks: "all" }));
			}
		} else {
			for (let i = 0; i < debuffsTransferred; i++) {
				const [debuff] = userDebuffs.splice(user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length, 1);
				receipts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				receipts.push(...removeModifier([user], { name: debuff, stacks: "all" }));
			}
		}
		for (const target of targets) {
			for (const modifier in target.modifiers) {
				if (getModifierCategory(modifier) === "Debuff") {
					receipts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
				}
			}
		}
		receipts.push(...addModifier([user], poison))
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}, { type: "single", team: "foe" })
	.setSidegrades("Centering Universal Solution")
	.setPactCost([poisonStacks, "Gain @{pactCost} @e{Poison} afterwards"])
	.setScalings({
		debuffsTransferred,
		debuffIncrement: 1
	})
	.setModifiers({ name: "Poison", stacks: poisonStacks })
	.setRnConfig({ debuffs: debuffsTransferred });
