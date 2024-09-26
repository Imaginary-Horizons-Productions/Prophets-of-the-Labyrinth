const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Accelerating Shortsword",
	[
		["use", "Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to the foe and @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to yourself"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed, quicken], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.element === element) {
				changeStagger(targets, "elementMatchFoe");
			}
		}
		const exposedTargets = addModifier([user, ...stillLivingTargets], exposed);
		if (exposedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, exposedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Exposed")}.`));
		}
		const addedQuicken = addModifier([user], quicken).length > 0;
		if (addedQuicken) {
			resultLines.push(`${user.name} gains ${getApplicationEmojiMarkdown("Quicken")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setDurability(15)
	.setDamage(40);
