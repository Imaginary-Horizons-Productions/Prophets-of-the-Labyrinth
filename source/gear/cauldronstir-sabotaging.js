const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines, getCombatantCounters } = require('../util/combatantUtil');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { rollablePotions } = require('../shared/potions');
const { essenceList } = require('../util/essenceUtil');

const gearName = "Sabotaging Cauldron Stir";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} stacks of a random vulnerability on a foe"],
		["Critical💥", "Add a random potion to loot"]
	],
	"Weapon",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, damage, modifiers: [vulnerability] } = module.exports;
		const pendingDamage = damage + user.getPower();
		const resultLines = [dealDamage(targets, user, pendingDamage, false, essence, adventure)];
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (user.essence === essence) {
			changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			const rolledPotion = rollablePotions[user.roundRns[`${gearName}${SAFE_DELIMITER}potions`][0] % rollablePotions.length];
			adventure.room.addResource(rolledPotion, "Item", "loot", 1);
			resultLines.push(`${user.name} sets a batch of ${rolledPotion} to simmer.`);
		}
		for (const target of stillLivingTargets) {
			const ineligibleEssences = getCombatantCounters(target);
			const essencePool = essenceList(ineligibleEssences);
			if (essencePool.length > 0) {
				const pendingVulnerability = `${essencePool[user.roundRns[`${gearName}${SAFE_DELIMITER}vulnerabilities`][0] % essencePool.length]} Vulnerability`;
				resultLines.push(...generateModifierResultLines(addModifier(stillLivingTargets, { name: pendingVulnerability, stacks: vulnerability.stacks })));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setModifiers({ name: "unparsed random vulnerability", stacks: 2 })
	.setSidegrades("Corrosive Cauldron Stir", "Toxic Cauldron Stir")
	.setCooldown(1)
	.setDamage(40)
	.setRnConfig({ potions: 1, vulnerabilities: 1 });
