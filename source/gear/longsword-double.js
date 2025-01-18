const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Double Longsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe twice, gain @{levelUps} extra level after combat if they're downed"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Offense",
	"Fire"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, levelUps } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(dealDamage(targets, user, pendingDamage, false, essence, adventure));
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", levelUps);
			resultLines.push(`${user.name} gains a level.`);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Lethal Longsword")
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(20),
		critBonus: 2,
		levelUps: 1
	});
