const { GearTemplate } = require('../classes');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { removeModifier, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');

const gearName = "Cleansing Barrier";
module.exports = new GearTemplate(gearName,
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} and cure a random debuff"],
		["Critical💥", "@{mod1} x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const receipts = addModifier([user], pendingVigilance).concat(addModifier([user], evade));
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		if (userDebuffs.length > 0) {
			const rolledDebuff = userDebuffs[user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length];
			receipts.push(...removeModifier([user], { name: rolledDebuff, stacks: "all" }));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Devoted Barrier", "Vigilant Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setCharges(5)
	.setRnConfig({ debuffs: 1 });
