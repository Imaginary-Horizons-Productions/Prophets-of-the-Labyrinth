const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier, removeModifier } = require('../util/combatantUtil');

const gearName = "Centering Universal Solution";
const debuffsTransfered = 2;
const poisonStacks = 3;
module.exports = new GearTemplate(gearName,
	[
		["use", "Transfer a random @{bonus} of your debuffs to a single foe and shrug off @{secondBonus} Stagger"],
		["Critical💥", "Transfer all of your debuffs"]
	],
	"Pact",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, bonus, modifiers: [poison], secondBonus } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const reciepts = [];
		if (user.crit) {
			for (const debuff of userDebuffs) {
				reciepts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				reciepts.push(...removeModifier([user], { name: debuff, stacks: "all" }));
			}
		} else {
			for (let i = 0; i < bonus; i++) {
				const debuff = userDebuffs.splice(user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length, 1);
				reciepts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				reciepts.push(...removeModifier([user], { name: debuff, stacks: "all" }));
			}
		}
		changeStagger([user], secondBonus);
		reciepts.push(...addModifier([user], poison));
		return generateModifierResultLines(combineModifierReceipts(reciepts)).concat(`${user.name} shrugs off some Stagger.`);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Tormenting Universal Solution")
	.setPactCost([poisonStacks, "Gain @{pactCost} @e{Poison} afterwards"])
	.setBonus(debuffsTransfered)
	.setModifiers({ name: "Poison", stacks: poisonStacks })
	.setRnConfig({ debuffs: debuffsTransfered })
	.setSecondBonus(2); // Stagger relieved
