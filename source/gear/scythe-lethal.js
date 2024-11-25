const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Lethal Scythe",
	[
		["use", "Strike a foe for @{damage} @{element} damage; instant death if foe is at or below @{bonus} HP"],
		["Critical💥", "Instant death threshold x@{critMultiplier}"]
	],
	"Weapon",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus: hpThreshold, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHPThreshold = hpThreshold;
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingHPThreshold *= critMultiplier;
		}
		if (target.hp > pendingHPThreshold) {
			return dealDamage([target], user, pendingDamage, false, element, adventure);
		} else {
			target.hp = 0;
			return [`${target.name} meets the reaper.`];
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Toxic Scythe", "Unstoppable Scythe")
	.setDurability(15)
	.setDamage(40)
	.setBonus(99) // execute threshold
	.setCritMultiplier(3);
