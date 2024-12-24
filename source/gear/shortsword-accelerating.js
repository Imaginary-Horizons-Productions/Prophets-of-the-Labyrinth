const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Shortsword",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, then apply @{mod0Stacks} @{mod0} to the foe and @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to yourself"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [exposed, quicken], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.essence === essence) {
				changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier([user, ...stillLivingTargets], exposed).concat(addModifier([user], quicken)))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Lethal Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setCooldown(1)
	.setDamage(40);
