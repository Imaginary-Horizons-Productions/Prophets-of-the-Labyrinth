const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
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
		const { modifiers: [regeneration], critMultiplier, essence } = module.exports;
		const pendingRegen = { ...regeneration };
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
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
	.setModifiers({ name: "Regeneration", stacks: 3 })
	.setCooldown(1)
	.setRnConfig({ debuffs: 1 });
