const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { addModifier, changeStagger, generateModifierResultLines, removeModifier } = require('../util/combatantUtil');

const gearName = "Cleansing Medicine";
module.exports = new GearTemplate(gearName,
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0} and cure them of a random debuff"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { modifiers: [regen], critMultiplier, element } = module.exports;
		const pendingRegen = { ...regen };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (user.crit) {
			pendingRegen.stacks *= critMultiplier;
		}
		const receipts = addModifier(targets, pendingRegen);
		for (const target of targets) {
			const debuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
			if (debuffs.length > 0) {
				const rolledDebuff = debuffs[user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][0] % debuffs.length];
				receipts.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
			}
		}

		return generateModifierResultLines(receipts);
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Bouncing Medicine", "Soothing Medicine")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setDurability(15)
	.setRnConfig({ debuffs: 1 });
