const { GearTemplate } = require('../classes');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { gainHealth, removeModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');

const gearName = "Cleansing Second Wind";
module.exports = new GearTemplate(gearName,
	[
		["use", "Regain @{damage} HP and shrug off a random debuff"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Unaligned",
	350,
	(targets, user, adventure) => {
		const { essence, critMultiplier } = module.exports;
		let pendingHealing = user.getPower();
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = [gainHealth(user, pendingHealing, adventure)];
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		if (userDebuffs.length > 0) {
			const rolledDebuff = userDebuffs[user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length];
			resultLines.push(...generateModifierResultLines(removeModifier([user], { name: rolledDebuff, stacks: "all" })));
		}
		return resultLines;
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Lucky Second Wind", "Soothing Second Wind")
	.setCooldown(2)
	.setDamage(0)
	.setRnConfig({ debuffs: 1 });
