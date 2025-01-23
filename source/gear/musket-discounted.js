const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { discountedPassive } = require('./shared/passiveDescriptions');
const { damageScalingGenerator } = require('./shared/scalings');

const variantName = "Discounted Musket";
module.exports = new GearTemplate(variantName,
	[
		discountedPassive,
		["use", "Deal <@{damage}> @{essence} damage to a foe"],
		["Critical💥", "Reset this gear's cooldown"]
	],
	"Adventuring",
	"Fire"
).setCost(100)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage }, cooldown } = module.exports;
		const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit && user.gear) {
			const move = adventure.room.findCombatantMove({ team: user.team, index: adventure.getCombatantIndex(user) });
			const [_, gearIndex] = move.name.split(SAFE_DELIMITER);
			user.gear[gearIndex].cooldown = -1 * cooldown;
			resultLines.push(`${user.name} reloads their ${variantName} immediately!`);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Hunter's Musket")
	.setCooldown(3)
	.setScalings({ damage: damageScalingGenerator(120) });
