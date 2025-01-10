const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, removeModifier } = require('../util/combatantUtil');

const gearName = "Hastening Medicine";
module.exports = new GearTemplate(gearName,
	[
		["use", "Cure @{bonus} random debuff on a single ally"],
		["Critical💥", "Debuffs cured x @{critMultiplier}, reduce the target's cooldowns by @{secondBonus}"]
	],
	"Spell",
	"Earth",
	350,
	([target], user, adventure) => {
		const { essence, bonus, critMultiplier, secondBonus } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		let pendingCures = bonus;
		const resultLines = [];
		if (user.crit) {
			pendingCures *= critMultiplier;
			let didCooldown = false;
			target.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= secondBonus;
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
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Urgent Medicine")
	.setCharges(15)
	.setBonus(1) // Debuffs cured
	.setRnConfig({ debuffs: 2 })
	.setSecondBonus(1); // Cooldown reduction
