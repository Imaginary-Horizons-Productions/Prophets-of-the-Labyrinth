const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Lethal Longsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, gain @{levelUps} extra level after combat if they're downed"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire",
	350,
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, levelUps } } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", levelUps);
		resultLines.push(`${user.name} gains a level.`);
	}
	return resultLines;
}, { type: "single", team: "foe" })
	.setSidegrades("Double Longsword")
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 3,
		levelUps: 1
	});
