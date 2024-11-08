const { GearTemplate, Move } = require('../classes');
const { dealDamage, changeStagger, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Stick",
	[
		["use", "Inflict @{damage} (x@{bonus} if foe has priority) @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier, modifiers: [frail] } = module.exports;
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}

		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= bonus;
		}

		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		addModifier([target], frail);
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Sharpened Stick", "Staggering Stick")
	.setDurability(15)
	.setDamage(40)
	.setBonus(2)
	.setModifiers({ name: "Frail", stacks: 4 });
