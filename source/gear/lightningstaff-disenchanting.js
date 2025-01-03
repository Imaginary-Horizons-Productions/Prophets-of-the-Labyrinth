const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, removeModifier } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Disenchanting Lightning Staff",
	[
		["use", `Deal @{damage} @{essence} damage and remove @{bonus} random debuff from ${bounceCount} random foes`],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Adventuring",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const reciepts = [];
		for (const target of targets) {
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			if (targetBuffs.length > 0) {
				for (let i = 0; i < pendingBuffRemovals; i++) {
					const selectedBuff = targetBuffs.splice(user.roundRns(`${gearName}${SAFE_DELIMITER}buffs`), 1);
					reciepts.push(...removeModifier([target], { name: selectedBuff, stacks: "all" }));
				}
			}
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setSidegrades("Hexing Lightning Staff")
	.setCooldown(2)
	.setRnConfig({ foes: 3, buffs: 1 })
	.setBonus(1);
