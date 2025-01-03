const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { addModifier, generateModifierResultLines, dealDamage, changeStagger, removeModifier, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Disenchanting Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and remove @{bonus} random buff from a single foe"],
		["Critical💥", "Deal @{damage} @{essence} damage"]
	],
	"Adventuring",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [incompatibility], damage } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const reciepts = addModifier(targets, incompatibility);
		const targetBuffs = Object.keys(targets[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		if (targetBuffs.length > 0) {
			for (let i = 0; i < pendingBuffRemovals; i++) {
				const selectedBuff = targetBuffs.splice(user.roundRns(`${gearName}${SAFE_DELIMITER}buffs`), 1);
				reciepts.push(...removeModifier(targets, { name: selectedBuff, stacks: "all" }));
			}
		}
		const resultLines = generateModifierResultLines(combineModifierReceipts(reciepts));
		if (user.crit) {
			resultLines.push(...dealDamage(targets, user, damage + user.getPower(), false, essence, adventure));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Fatiguing Wave Crash")
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 })
	.setDamage(40)
	.setBonus(1)
	.setRnConfig({ buffs: 1 });
