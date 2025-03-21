const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { addModifier, generateModifierResultLines, dealDamage, changeStagger, removeModifier, combineModifierReceipts } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Disenchanting Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and remove @{buffsRemoved} random buff from a foe"],
		["critical", "Deal <@{damage}> @{essence} damage"]
	],
	"Adventuring",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [incompatibility], scalings: { damage } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const receipts = addModifier(targets, incompatibility);
		const targetBuffs = Object.keys(targets[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		if (targetBuffs.length > 0) {
			for (let i = 0; i < pendingBuffRemovals; i++) {
				const [selectedBuff] = targetBuffs.splice(user.roundRns(`${module.exports.name}${SAFE_DELIMITER}buffs`), 1);
				receipts.push(...removeModifier(targets, { name: selectedBuff, stacks: "all" }));
			}
		}
		const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
		if (user.crit) {
			resultLines.push(...dealDamage(targets, user, damage.calculate(user), false, essence, adventure).resultLines);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Fatiguing Wave Crash")
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 })
	.setScalings({
		damage: damageScalingGenerator(40),
		buffsRemoved: 1
	})
	.setRnConfig({ buffs: 1 });
