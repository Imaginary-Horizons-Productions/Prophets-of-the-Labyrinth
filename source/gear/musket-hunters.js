const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const variantName = "Hunter's Musket";
module.exports = new GearTemplate(variantName,
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, gain @{mod0Stacks} @{mod0} if they're downed"],
		["critical", "Reset this gear's cooldown"]
	],
	"Adventuring",
	"Fire"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage }, cooldown, modifiers: [empowerment] } = module.exports;
		const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (survivors.length < targets.length) {
			resultLines.push(...generateModifierResultLines(addModifier([user], empowerment)));
		}
		if (user.crit && user.gear) {
			const move = adventure.room.findCombatantMove({ team: user.team, index: adventure.getCombatantIndex(user) });
			const [_, gearIndex] = move.name.split(SAFE_DELIMITER);
			user.gear[gearIndex].cooldown = -1 * cooldown;
			resultLines.push(`${user.name} reloads their ${variantName} immediately!`);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Discounted Musket")
	.setCooldown(3)
	.setScalings({ damage: damageScalingGenerator(120) })
	.setModifiers({ name: "Empowerment", stacks: 25 });
