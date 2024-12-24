const { GearTemplate } = require('../classes/index.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Midas's Firecracker",
	[
		["use", "Strike 3 random foes applying @{mod0Stacks} @{mod0} and @{damage} @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [curse], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.essence === essence) {
				changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(stillLivingTargets, curse))));
		}
		return resultLines;
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe" })
	.setSidegrades("Double Firecracker", "Toxic Firecracker")
	.setModifiers({ name: "Curse of Midas", stacks: 1 })
	.setCooldown(1)
	.setDamage(5)
	.setRnConfig({ "foes": 3 });
