const { GearTemplate, Move } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Battleaxe",
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if after target> @{essence} damage, gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [exposed], damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= bonus;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier([user], exposed)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Furious Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setCooldown(1)
	.setDamage(90)
	.setBonus(75); // Reactive damage
