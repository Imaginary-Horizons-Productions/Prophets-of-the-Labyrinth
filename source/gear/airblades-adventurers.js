const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, payHP, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Adventurer's Air Blades",
	[
		["use", "Strike a foe for @{damage} @{essence} damage twice; gain an extra level after combat on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, pactCost: [pactCostValue], damage, critMultiplier } = module.exports;
		const resultLines = payHP(user, pactCostValue, adventure);
		if (adventure.lives < 1) {
			return resultLines;
		}
		let pendingDamage = damage + user.getPower();
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		resultLines.push(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
		resultLines.push(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(user)}`, "levelsGained", "loot", 1);
			resultLines.push(`${user.name} gains a level.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Toxic Air Blade", "Unstoppable Air Blade")
	.setDamage(20)
	.setPactCost([25, "@{pactCost} HP"])
	.setCooldown(0);
