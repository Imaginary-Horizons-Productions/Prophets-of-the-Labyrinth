const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, addModifier, getCombatantCounters, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

const gearName = "Pistol";
module.exports = new GearTemplate(gearName,
	[
		["use", "Strike a foe for @{damage} @{essence} damage, give a random ally <@{mod0Stacks} ÷ target's Vulnerability debuffs> @{mod0} if the foe is weak to @{essence}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Unaligned",
	200,
	(targets, user, adventure) => {
		const { damage, critMultiplier, essence, modifiers: [empowerment] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (targets.some(target => getCombatantCounters(target).includes(essence))) {
			const inducedVulnerabilityCount = Object.keys(targets[0].modifiers).filter(modifier => modifier.endsWith("Vulnerability")).length;
			const pendingEmpowerment = { name: "Empowerment", stacks: Math.floor(empowerment.stacks / inducedVulnerabilityCount) };
			const allyTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
			const selectedAllies = [];
			for (let i = 0; i < user.roundRns[`${gearName}${SAFE_DELIMITER}allies`].length; i++) {
				selectedAllies.push(allyTeam[user.roundRns[`${gearName}${SAFE_DELIMITER}allies`][i] % allyTeam.length]);
			}
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(selectedAllies, pendingEmpowerment))));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Double Pistol", "Duelist's Pistol", "Flanking Pistol")
	.setModifiers({ name: "Empowerment", stacks: 30 })
	.setCooldown(1)
	.setDamage(40)
	.setRnConfig({ "allies": 1 });
