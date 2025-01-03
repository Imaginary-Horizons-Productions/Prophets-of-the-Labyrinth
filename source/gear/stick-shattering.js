const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Stick",
	[
		["use", "Inflict <@{damage} x @{bonus} if foe has priority> @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier, modifiers: [frail] } = module.exports;
		let pendingDamage = damage + user.getPower();
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
		}

		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		if (targetMove.priority > 0) {
			pendingDamage *= bonus;
		}

		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(addModifier([target], frail)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Sharpened Stick", "Staggering Stick")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(2)
	.setModifiers({ name: "Frail", stacks: 4 });
