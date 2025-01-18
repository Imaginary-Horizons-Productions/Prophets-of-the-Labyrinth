const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, removeModifier } = require('../util/combatantUtil');

const variantName = "Medicine";
module.exports = new GearTemplate(variantName,
	[
		["use", "Cure @{debuffsCured} random debuff on an ally"],
		["Critical💥", "Debuffs cured x @{critBonus}"]
	],
	"Spell",
	"Earth"
).setCost(200)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { debuffsCured, critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingCures = debuffsCured;
		if (user.crit) {
			pendingCures *= critBonus;
		}
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const reciepts = [];
		for (let i = 0; i < pendingCures; i++) {
			const selectedDebuff = targetDebuffs.splice(user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
			reciepts.push(...removeModifier([target], { name: selectedDebuff, stacks: "all" }));
		}
		return generateModifierResultLines(combineModifierReceipts(reciepts));
	}, { type: "single", team: "ally" })
	.setUpgrades("Hastening Medicine", "Urgent Medicine")
	.setCharges(15)
	.setScalings({
		debuffsCured: 1,
		critBonus: 2
	})
	.setRnConfig({ debuffs: 2 });
