const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, removeModifier, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingImpotence } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

const variantName = "Fatiguing Arcane Sledge";
module.exports = new GearTemplate(variantName,
	[
		["use", "Deal <@{damage}> @{essence} damage, inflict @{mod0Stacks} @{mod0}, and remove @{buffsRemoved} random buff from a foe"],
		["Critical💥", "Buffs removed x @{critBonus}"]
	],
	"Support",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [impotence], scalings: { damage, buffsRemoved, critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingBuffRemovals = buffsRemoved;
		if (user.crit) {
			pendingBuffRemovals *= critBonus;
		}
		const targetBuffs = Object.keys(targets[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		const reciepts = addModifier(targets, { name: impotence.name, stacks: impotence.stacks.calculate(user) });
		if (targetBuffs.length > 0) {
			for (let i = 0; i < pendingBuffRemovals; i++) {
				const selectedBuff = targetBuffs.splice(user.roundRns(`${variantName}${SAFE_DELIMITER}buffs`), 1);
				reciepts.push(...removeModifier(targets, { name: selectedBuff, stacks: "all" }));
			}
		}
		const pendingDamage = damage.calculate(user);
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Kinetic Arcane Sledge")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		buffsRemoved: 1,
		critBonus: 2
	})
	.setRnConfig({ buffs: 2 })
	.setModifiers(scalingImpotence(2));
