const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { gainHealth, removeModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Cleansing Second Wind",
	[
		["use", "Regain @{damage} HP and shrug off a random debuff"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, critMultiplier } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = [gainHealth(user, pendingHealing, adventure)];
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (userDebuffs.length > 0) {
			const rolledDebuff = userDebuffs[user.roundRns[`Cleansing Second Wind${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length];
			resultLines.push(...generateModifierResultLines(removeModifier([user], { name: rolledDebuff, stacks: "all" })));
		}
		return resultLines;
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setSidegrades("Lucky Second Wind", "Soothing Second Wind")
	.setDurability(10)
	.setDamage(0)
	.setRnConfig({ debuffs: 1 });
