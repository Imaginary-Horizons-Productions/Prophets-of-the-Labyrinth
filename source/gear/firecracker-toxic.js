const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage, addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Toxic Firecracker",
	[
		["use", "Strike 3 random foes applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.element === element) {
				changeStagger(stillLivingTargets, "elementMatchFoe");
			}
			const poisonedTargets = addModifier(stillLivingTargets, poison);
			if (poisonedTargets.length > 0) {
				resultLines.push(joinAsStatement(false, poisonedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Poison")}.`));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Firecracker", "Midas's Firecracker")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(5);
