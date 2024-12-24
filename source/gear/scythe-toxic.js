const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Scythe",
	[
		["use", "Strike a foe applying @{mod0Stacks} @{mod0} and @{damage} @{essence} damage; instant death if foe is at or below @{bonus} HP"],
		["Critical💥", "Instant death threshold x@{critMultiplier}"]
	],
	"Weapon",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [poison], damage, bonus: hpThreshold, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHPThreshold = hpThreshold;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingHPThreshold *= critMultiplier;
		}
		if (target.hp > pendingHPThreshold) {
			return dealDamage([target], user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier([target], poison)));
		} else {
			target.hp = 0;
			return [`${target.name} meets the reaper.`];
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Lethal Scythe", "Unstoppable Scythe")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setCooldown(1)
	.setDamage(40)
	.setBonus(99); // execute threshold
