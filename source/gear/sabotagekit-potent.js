const { GearTemplate } = require('../classes/index.js');
const { SAFE_DELIMITER } = require('../constants.js');
const { addModifier, getCombatantWeaknesses, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');
const { elementsList, getResistances } = require('../util/elementUtil.js');

const gearName = "Potent Sabotage Kit";
module.exports = new GearTemplate(gearName,
	[
		["use", "Afflict a foe with @{mod0Stacks} @{mod0} and @{mod1Stacks} stacks of a random weakness"],
		["Critical💥", "Slow and Weakness +@{bonus}"]
	],
	"Weapon",
	"Untyped",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [slow, weakness], bonus } = module.exports;
		const pendingSlow = { ...slow };
		const pendingWeakness = { stacks: weakness.stacks };
		if (user.crit) {
			pendingSlow.stacks += bonus;
			pendingWeakness.stacks += bonus;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const receipts = addModifier([target], pendingSlow);
		const ineligibleWeaknesses = getResistances(target.element).concat(getCombatantWeaknesses(target));
		const weaknessPool = elementsList(ineligibleWeaknesses);
		if (weaknessPool.length > 0) {
			pendingWeakness.name = `${weaknessPool[user.roundRns[`${gearName}${SAFE_DELIMITER}weaknesses`][0] % weaknessPool.length]} Weakness`;
			receipts.unshift(...addModifier([target], pendingWeakness));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setSidegrades("Shattering Sabotage Kit", "Urgent Sabotage Kit")
	.setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Slow", stacks: 3 }, { name: "unparsed random weakness", stacks: 4 })
	.setBonus(2) // Crit Slow and Weakness stacks
	.setDurability(15)
	.setFlavorText({ name: "Eligible Weaknesses", value: "The rolled weakness won't be one of the target's resistances or existing weaknesses" })
	.setRnConfig({ "weaknesses": 1 });
