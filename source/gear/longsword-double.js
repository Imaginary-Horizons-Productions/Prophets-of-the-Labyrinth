const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Double Longsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe twice, gain @{levelUps} extra level after combat if they're downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, levelUps } } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines: firstresultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const { resultLines: secondresultLines, survivors: finalSurvivors } = dealDamage(survivors, user, pendingDamage, false, essence, adventure);
		const allresultLines = firstresultLines.concat(secondresultLines);
		if (user.essence === essence) {
			changeStagger(finalSurvivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (finalSurvivors.length < targets.length) {
			adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", levelUps);
			allresultLines.push(`${user.name} gains a level.`);
		}
		return allresultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Lethal Longsword")
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(20),
		critBonus: 2,
		levelUps: 1
	});
