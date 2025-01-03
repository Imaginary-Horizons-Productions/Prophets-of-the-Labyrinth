const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { discountedPassive } = require('./descriptions/passives');

const gearName = "Discounted Musket";
module.exports = new GearTemplate(gearName,
	[
		discountedPassive,
		["use", "Deal @{damage} @{essence} damage to a single foe"],
		["Critical💥", "Reset this gear's cooldown"]
	],
	"Adventuring",
	"Fire",
	100,
	(targets, user, adventure) => {
		const { essence, damage, cooldown } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, damage, false, essence, adventure);
		if (user.crit && user.gear) {
			const move = adventure.room.findCombatantMove({ team: user.team, index: adventure.getCombatantIndex(user) });
			const [_, gearIndex] = move.name.split(SAFE_DELIMITER);
			user.gear[gearIndex].cooldown = -1 * cooldown;
			resultLines.push(`${user.name} reloads their ${gearName} immediately!`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Hunter's Musket")
	.setCooldown(3)
	.setDamage(120);
