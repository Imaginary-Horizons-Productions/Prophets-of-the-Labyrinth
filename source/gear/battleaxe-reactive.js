const { GearTemplate, Move } = require('../classes/index.js');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Reactive Battleaxe",
	[
		["use", "Strike a foe for @{damage} (x@{bonus} if after foe) @{element} damage, gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === targets[0].team && move.userReference.index === adventure.getCombatantIndex(targets[0]));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage *= bonus;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedExposed = addModifier([user], exposed).length > 0;
		if (addedExposed) {
			resultLines.push(`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Exposed")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Furious Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(30)
	.setDamage(90)
	.setBonus(2); // Reactive multiplier
