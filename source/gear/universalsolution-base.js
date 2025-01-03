const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier, removeModifier } = require('../util/combatantUtil');

const gearName = "Universal Solution";
module.exports = new GearTemplate(gearName,
	[
		["use", "Transfer a random @{bonus} of your debuffs to a single foe"],
		["Critical💥", "Transfer all of your debuffs"]
	],
	"Pact",
	"Water",
	200,
	(targets, user, adventure) => {
		const { essence, bonus, modifiers: [poison] } = module.exports;
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
		reciepts.push(...addModifier([user], poison))
		return generateModifierResultLines(combineModifierReceipts(reciepts));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Centering Universal Solution", "Tormenting Universal Solution")
	.setPactCost([3, "Gain @{pactCost} @e{Poison}"])
	.setBonus(2) // Debuffs transfered
	.setModifiers({ name: "Poison", stacks: 3 })
	.setRnConfig({ debuffs: 2 });
