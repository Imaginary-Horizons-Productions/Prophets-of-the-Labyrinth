const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Shortsword",
	[
		["use", "Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to the foe and @{mod0Stacks} @{mod0} to yourself"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [exposed, poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		const receipts = addModifier([user], exposed);
		if (target.hp > 0) {
			if (user.element === element) {
				changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
			}
			receipts.push(...addModifier([target], poison), ...addModifier([target], exposed));
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Accelerating Shortsword", "Lethal Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Poison", stacks: 3 })
	.setCooldown(1)
	.setDamage(40);
