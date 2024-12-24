const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Stick",
	[
		["use", "Inflict <@{damage} x @{bonus} if foe has priority> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { essence, damage, bonus, critMultiplier, modifiers: [frail] } = module.exports;
		let pendingDamage = damage + user.getPower();
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}

		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		if (targetMove.priority > 0) {
			pendingDamage *= bonus;
		}

		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		addModifier([target], frail);
		return dealDamage([target], user, pendingDamage, false, essence, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Sharpened Stick", "Staggering Stick")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(2)
	.setModifiers({ name: "Frail", stacks: 4 });
