const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Stick",
	[
		["use", "Strike a foe for <@{damage} x @{bonus} if foe has priority> @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier, stagger } = module.exports;
		let pendingDamage = damage + user.getPower();
		let pendingStagger = stagger;
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		changeStagger([target], user, pendingStagger);

		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		if (targetMove.priority > 0) {
			pendingDamage *= bonus;
		}

		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Sharpened Stick", "Shattering Stick")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(2)
	.setStagger(2);
