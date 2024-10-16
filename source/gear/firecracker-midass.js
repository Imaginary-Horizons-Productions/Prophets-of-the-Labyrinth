const { GearTemplate } = require('../classes/index.js');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage, changeStagger, addModifier, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Midas's Firecracker",
	[
		["use", "Strike 3 random foes applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [curse], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (user.element === element) {
			changeStagger(stillLivingTargets, "elementMatchFoe");
		}
		const cursedTargets = addModifier(stillLivingTargets, curse);
		if (cursedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, getNames(cursedTargets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Curse of Midas")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Firecracker", "Toxic Firecracker")
	.setModifiers({ name: "Curse of Midas", stacks: 1 })
	.setDurability(15)
	.setDamage(5)
	.setRnConfig({ "foes": 3 });