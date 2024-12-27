const { GearTemplate } = require('../classes/index.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, getCombatantCounters } = require('../util/combatantUtil.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');

const gearName = "Flanking Pistol";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod1Stacks} @{mod1} on a foe, give a random ally <@{mod0Stacks} ÷ target's Vulnerability debuffs> @{mod0} if the foe is weak to @{essence}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Unaligned",
	350,
	(targets, user, adventure) => {
		const { damage, critMultiplier, essence, modifiers: [empowerment, exposure] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const receipts = addModifier(targets, exposure);
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
		return resultLines.concat(generateModifierResultLines(receipts));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Double Pistol", "Duelist's Pistol")
	.setModifiers({ name: "Empowerment", stacks: 30 }, { name: "Exposure", stacks: 2 })
	.setCooldown(1)
	.setDamage(40)
	.setRnConfig({ "allies": 1 });
