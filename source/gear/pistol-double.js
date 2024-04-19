const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Double Pistol",
	"Strike a foe for @{damage} @{element} damage, give 2 random allies @{mod0Stacks} @{mod0} if the foe is weak to @{element}",
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
			const poweredUpAllies = [];
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies;
			const selectedAllies = [];
			for (let i = 0; i < 2; i++) {
				selectedAllies.push(allyTeam[adventure.generateRandomNumber(allyTeam.length, "battle")]);
			}
			poweredUpAllies.concat(getNames(addModifier(selectedAllies, powerUp), adventure));
			return `${damageText} ${joinAsStatement(false, poweredUpAllies, "is", "are", "Powered Up!")}`;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Duelist's Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(40);
