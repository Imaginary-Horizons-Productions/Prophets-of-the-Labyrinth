const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier, removeModifier } = require('../util/combatantUtil');

const variantName = "Centering Universal Solution";
const debuffsTransferred = 2;
const poisonStacks = 3;
module.exports = new GearTemplate(variantName,
	[
		["use", "Transfer a random @{debuffsTransferred} of your debuffs to a foe and shrug off @{staggerRelief} Stagger"],
		["critical", "Transfer all of your debuffs"]
	],
	"Pact",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { debuffsTransferred, staggerRelief }, modifiers: [poison] } = module.exports;
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
		changeStagger([user], user, staggerRelief);
		receipts.push(...addModifier([user], poison));
		return generateModifierResultLines(combineModifierReceipts(receipts)).concat(`${user.name} shrugs off some Stagger.`);
	}, { type: "single", team: "foe" })
	.setSidegrades("Tormenting Universal Solution")
	.setPactCost([poisonStacks, "Gain @{pactCost} @e{Poison} afterwards"])
	.setScalings({
		debuffsTransferred,
		staggerRelief: 2
	})
	.setModifiers({ name: "Poison", stacks: poisonStacks })
	.setRnConfig({ debuffs: debuffsTransferred });
