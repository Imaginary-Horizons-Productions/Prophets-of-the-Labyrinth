const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Duelist's Lance",
	[
		["use", "Strike a foe for <@{damage} + @{bonusSpeed} + @{bonus} if only attacker> @{element} damage, then gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [quicken], damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + Math.max(0, user.getSpeed(true) - 100) + damage;
		// Duelist's check
		const userIndex = adventure.getCombatantIndex(user);
		const targetIndex = adventure.getCombatant(targets[0]);
		if (!adventure.room.moves.some(move => !(move.userReference.team === user.team && move.userReference.index === userIndex) && move.targets.some(moveTarget => moveTarget.team === targets[0].team && moveTarget.index === targetIndex))) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(addModifier([user], quicken)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Shattering Lance", "Surpassing Lance")
	.setModifiers({ name: "Quicken", stacks: 1 })
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75); // Duelist's damage
