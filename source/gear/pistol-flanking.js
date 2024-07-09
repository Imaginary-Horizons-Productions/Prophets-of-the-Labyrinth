const { GearTemplate } = require('../classes/index.js');
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Flanking Pistol",
	"Inflict @{damage} @{element} damage and @{mod1Stacks} @{mod1} on a foe, give a random ally @{mod0Stacks} @{mod0} if the foe is weak to @{element}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { damage, critMultiplier, element, modifiers: [powerUp] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (targets.some(target => getCombatantWeaknesses(target).includes(element))) {
			const damageText = dealDamage(targets, user, pendingDamage, false, element, adventure);
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies;
			const ally = allyTeam[adventure.generateRandomNumber(allyTeam.length, "battle")];
			const addedPowerUp = addModifier([ally], powerUp).length > 0;
			return `${damageText}${addedPowerUp ? ` ${getNames([user], adventure)[0]} was Powered Up!` : ""}`
		} else {
			return dealDamage(targets, user, pendingDamage, false, element, adventure);
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Pistol", "Duelist's Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 }, { name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(40);
