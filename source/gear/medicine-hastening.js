const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, removeModifier } = require('../util/combatantUtil');

const gearName = "Hastening Medicine";
module.exports = new GearTemplate(gearName,
	[
		["use", "Cure @{debuffsCured} random debuff on a single ally"],
		["Critical💥", "Debuffs cured x @{critBonus}, reduce the target's cooldowns by @{cooldownReduction}"]
	],
	"Spell",
	"Earth"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { debuffsCured, critBonus, cooldownReduction } } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingCures = debuffsCured;
		const resultLines = [];
		if (user.crit) {
			pendingCures *= critBonus;
			let didCooldown = false;
			target.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= cooldownReduction;
				}
			})
			if (didCooldown) {
				resultLines.push(`${target.name}'s cooldowns were hastened.`);
			}
		}
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const reciepts = [];
		for (let i = 0; i < pendingCures; i++) {
			const selectedDebuff = targetDebuffs.splice(user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
			reciepts.push(...removeModifier([target], { name: selectedDebuff, stacks: "all" }));
		}
		return generateModifierResultLines(combineModifierReceipts(reciepts)).concat(resultLines);
	}, { type: "single", team: "ally" })
	.setSidegrades("Urgent Medicine")
	.setCharges(15)
	.setScalings({
		debuffsCured: 1,
		critBonus: 2,
		cooldownReduction: 1
	})
	.setRnConfig({ debuffs: 2 });
