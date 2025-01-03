const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

const gearName = "Hunter's Musket";
module.exports = new GearTemplate(gearName,
	[
		["use", "Deal @{damage} @{essence} damage to a single foe, gain @{mod0Stacks} @{mod0} if they're downed"],
		["Critical💥", "Reset this gear's cooldown"]
	],
	"Adventuring",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, damage, cooldown, modifiers: [empowerment] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, damage, false, essence, adventure);
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			resultLines.push(...generateModifierResultLines(addModifier([user], empowerment)));
		}
		if (user.crit && user.gear) {
			const move = adventure.room.findCombatantMove({ team: user.team, index: adventure.getCombatantIndex(user) });
			const [_, gearIndex] = move.name.split(SAFE_DELIMITER);
			user.gear[gearIndex].cooldown = -1 * cooldown;
			resultLines.push(`${user.name} reloads their ${gearName} immediately!`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Discounted Musket", "Hunter's Musket")
	.setCooldown(3)
	.setDamage(120)
	.setModifiers({ name: "Empowerment", stacks: 25 });