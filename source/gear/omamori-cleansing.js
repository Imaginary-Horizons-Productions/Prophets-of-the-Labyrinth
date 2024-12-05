const { GearTemplate } = require('../classes');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, addProtection, addModifier, removeModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');

const gearName = "Cleansing Omamori";
module.exports = new GearTemplate(gearName,
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection, then shrug off a random debuff"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		const receipts = addModifier([user], pendingLucky);
		const debuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		if (debuffs.length > 0) {
			const rolledDebuff = debuffs[user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][0] % debuffs.length];
			receipts.push(...removeModifier([user], { name: rolledDebuff, stacks: "all" }));
		}
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Centering Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setCooldown(2)
	.setRnConfig({ debuffs: 1 });
