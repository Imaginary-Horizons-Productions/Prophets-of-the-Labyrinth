const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, removeModifier, dealDamage, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const variantName = "Arcane Sledge";
module.exports = new GearTemplate(variantName,
	[
		["use", "Deal <@{damage}> @{essence} damage and remove @{buffsRemoved} random buff from a foe"],
		["Critical💥", "Buffs removed x @{critBonus}"]
	],
	"Support",
	"Wind"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, buffsRemoved, critBonus } } = module.exports;
		const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
		if (survivors.length > 0) {
			if (user.essence === essence) {
				changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			let pendingBuffRemovals = buffsRemoved;
			if (user.crit) {
				pendingBuffRemovals *= critBonus;
			}
			const targetBuffs = Object.keys(survivors[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			const receipts = [];
			if (targetBuffs.length > 0) {
				for (let i = 0; i < pendingBuffRemovals; i++) {
					const [selectedBuff] = targetBuffs.splice(user.roundRns(`${variantName}${SAFE_DELIMITER}buffs`), 1);
					receipts.push(...removeModifier(survivors, { name: selectedBuff, stacks: "all" }));
				}
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(receipts)));
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Fatiguing Arcane Sledge", "Kinetic Arcane Sledge")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		buffsRemoved: 1,
		critBonus: 2
	})
	.setRnConfig({ buffs: 2 });
