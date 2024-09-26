const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Double Pistol",
	[
		["use", "Strike a foe for @{damage} @{element} damage, give 2 random allies @{mod0Stacks} @{mod0} if the foe is weak to @{element}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Untyped",
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
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		if (targets.some(target => getCombatantWeaknesses(target).includes(element))) {
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			const selectedAllies = [];
			for (let i = 0; i < 2; i++) {
				selectedAllies.push(allyTeam[adventure.generateRandomNumber(allyTeam.length, "battle")]);
			}
			const poweredUpAllies = addModifier(selectedAllies, powerUp);
			if (poweredUpAllies.length > 0) {
				resultLines.push(joinAsStatement(false, poweredUpAllies.map(ally => ally.name), "gains", "gain", `${getApplicationEmojiMarkdown("Power Up")}!`));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Duelist's Pistol", "Flanking Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(40);
