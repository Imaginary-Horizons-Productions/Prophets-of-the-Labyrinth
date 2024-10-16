const { GearTemplate } = require('../classes/index.js');
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

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
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const receipts = addModifier(targets, exposed);
		if (targets.some(target => getCombatantWeaknesses(target).includes(element))) {
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			const ally = allyTeam[user.roundRns[`Pistol${SAFE_DELIMITER}allies`][0] % allyTeam.length];
			receipts.push(...addModifier([ally], powerUp));
		}
		return resultLines.concat(generateModifierResultLines(receipts));
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Pistol", "Duelist's Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 }, { name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(40)
	.setRnConfig({ "allies": 1 });
