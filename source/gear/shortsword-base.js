const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Shortsword",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, then apply @{mod0Stacks} @{mod0} to both the foe and yourself"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (user.essence === essence) {
			changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier([user, ...stillLivingTargets], exposed))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Accelerating Shortsword", "Lethal Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setCooldown(1)
	.setDamage(40);
