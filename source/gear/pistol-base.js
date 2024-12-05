const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, addModifier, getCombatantWeaknesses, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

const gearName = "Pistol";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for @{damage} @{element} damage, give a random ally <@{mod0Stacks} ÷ target's Weakness debuffs> @{mod0} if the foe is weak to @{element}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Untyped",
	200,
	(targets, user, adventure) => {
		const { damage, critMultiplier, element, modifiers: [powerUp] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		if (targets.some(target => getCombatantWeaknesses(target).includes(element))) {
			const inducedWeaknessCount = Object.keys(targets[0].modifiers).filter(modifier => modifier.endsWith("Weakness")).length;
			const pendingPowerUp = { name: "Power Up", stacks: Math.floor(powerUp.stacks / inducedWeaknessCount) };
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			const selectedAllies = [];
			for (let i = 0; i < user.roundRns[`${gearName}${SAFE_DELIMITER}allies`].length; i++) {
				selectedAllies.push(allyTeam[user.roundRns[`${gearName}${SAFE_DELIMITER}allies`][i] % allyTeam.length]);
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(selectedAllies, pendingPowerUp))));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Double Pistol", "Duelist's Pistol", "Flanking Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setCooldown(1)
	.setDamage(40)
	.setRnConfig({ "allies": 1 });
