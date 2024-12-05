const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Firecracker",
	[
		["use", "Strike 3 random foes applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.element === element) {
				changeStagger(stillLivingTargets, user, ELEMENT_MATCH_STAGGER_FOE);
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(stillLivingTargets, poison))));
		}
		return resultLines;
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe" })
	.setSidegrades("Double Firecracker", "Midas's Firecracker")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setCooldown(1)
	.setDamage(5)
	.setRnConfig({ "foes": 3 });
