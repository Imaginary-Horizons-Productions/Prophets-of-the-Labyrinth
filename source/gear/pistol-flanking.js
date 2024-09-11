const { GearTemplate } = require('../classes/index.js');
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Flanking Pistol",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod1Stacks} @{mod1} on a foe, give a random ally @{mod0Stacks} @{mod0} if the foe is weak to @{element}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { damage, critMultiplier, element, modifiers: [powerUp, exposed] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		if (targets.some(target => getCombatantWeaknesses(target).includes(element))) {
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies;
			const ally = allyTeam[adventure.generateRandomNumber(allyTeam.length, "battle")];
			const addedPowerUp = addModifier([ally], powerUp).length > 0;
			if (addedPowerUp) {
				resultSentences.push(`${getNames([ally], adventure)[0]} was Powered Up!`);
			}
		}
		const exposedTargets = addModifier(targets, exposed);
		if (exposedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(exposedTargets, adventure), "is", "are", "Exposed."));
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Pistol", "Duelist's Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 }, { name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(40);
