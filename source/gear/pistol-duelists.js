const { GearTemplate } = require("../classes");
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger, getNames } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

module.exports = new GearTemplate("Duelist's Pistol",
	[
		["use", "Strike a foe for @{damage} (+@{bonus} if only attacker) @{element} damage, give a random ally @{mod0Stacks} @{mod0} if the foe is weak to @{element}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Untyped",
	350,
	([target], user, isCrit, adventure) => {
		const { damage, bonus, critMultiplier, element, modifiers: [powerUp] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const targetIndex = adventure.getCombatantIndex(target);
		const userIndex = adventure.getCombatantIndex(user);
		// Duelist's check
		if (!adventure.room.moves.some(move => !(move.userReference.team === user.team && move.userReference.index === userIndex) && move.targets.some(moveTarget => moveTarget.team === target.team && moveTarget.index === targetIndex))) {
			pendingDamage += bonus;
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (getCombatantWeaknesses(target).includes(element)) {
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			const ally = allyTeam[adventure.generateRandomNumber(allyTeam.length, "battle")];
			const addedPowerUp = addModifier([ally], powerUp).length > 0;
			if (addedPowerUp) {
				resultLines.push(`${getNames([ally], adventure)[0]} gains ${getApplicationEmojiMarkdown("Power Up")}!`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Pistol", "Flanking Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(40)
	.setBonus(75);
