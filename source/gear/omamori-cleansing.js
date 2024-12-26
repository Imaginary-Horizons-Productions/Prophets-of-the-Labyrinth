const { GearTemplate } = require('../classes');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, addProtection, addModifier, removeModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');

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
		const { essence, modifiers: [finesse], protection, critMultiplier } = module.exports;
		const pendingFinesse = { ...finesse };
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingFinesse.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		const receipts = addModifier([user], pendingFinesse);
		const debuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		if (debuffs.length > 0) {
			const rolledDebuff = debuffs[user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][0] % debuffs.length];
			receipts.push(...removeModifier([user], { name: rolledDebuff, stacks: "all" }));
		}
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Centering Omamori", "Devoted Omamori")
	.setModifiers({ name: "Finesse", stacks: 2 })
	.setProtection(50)
	.setCooldown(2)
	.setRnConfig({ debuffs: 1 });
