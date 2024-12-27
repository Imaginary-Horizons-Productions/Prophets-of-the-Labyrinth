const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Shortsword",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, then apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to the foe and @{mod0Stacks} @{mod0} to yourself"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [exposure, poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, essence, adventure);
		const receipts = addModifier([user], exposure);
		if (target.hp > 0) {
			if (user.essence === essence) {
				changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
			}
			receipts.push(...addModifier([target], poison), ...addModifier([target], exposure));
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Accelerating Shortsword", "Lethal Shortsword")
	.setModifiers({ name: "Exposure", stacks: 1 }, { name: "Poison", stacks: 3 })
	.setCooldown(1)
	.setDamage(40);
