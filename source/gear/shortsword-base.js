const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Shortsword",
	[
		["use", "Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to both the foe and yourself"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (user.element === element) {
			changeStagger(stillLivingTargets, "elementMatchFoe");
		}
		const exposedTargets = addModifier([user, ...stillLivingTargets], exposed);
		if (exposedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, exposedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Exposed")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Accelerating Shortsword", "Lethal Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(40);
