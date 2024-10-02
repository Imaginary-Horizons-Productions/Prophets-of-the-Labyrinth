const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { changeStagger, addProtection, addModifier, removeModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Cleansing Omamori",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection, then shrug off a random debuff"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		const receipts = addModifier([user], pendingLucky);
		const debuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (debuffs.length > 0) {
			const rolledDebuff = debuffs[adventure.generateRandomNumber(debuffs.length, "battle")];
			receipts.push(...removeModifier([user], { name: rolledDebuff, stacks: "all" }));
		}
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: true })
	.setSidegrades("Centering Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setDurability(10);
