const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger, dealDamage } = require('../util/combatantUtil');
const { accuratePassive } = require('./shared/passiveDescriptions');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Accurate Overburn Explosion",
	[
		accuratePassive,
		["use", "Deal <@{damage}> @{essence} damage to a foe and all foes with @{mod0}"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Pact",
	"Fire"
).setCost(350)
	.setEffect(
		(targets, user, adventure) => {
			const { essence, modifiers: [targetModifier], scalings: { damage, critBonus }, pactCost } = module.exports;
			const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);
			let pendingDamage = damage.calculate(user);
			if (user.crit) {
				pendingDamage *= critBonus;
			}
			const { resultLines, survivors } = dealDamage(allTargets, user, pendingDamage, false, essence, adventure);
			if (user.essence === essence) {
				changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			if (user.gear) {
				for (const gear of user.gear) {
					gear.cooldown += pactCost[0];
				}
				resultLines.push(`${user.name} is burnt out.`);
			}
			return resultLines;
		}, { type: "single", team: "foe" })
	.setSidegrades("Unstoppable Overburn Explosion")
	.setPactCost([2, "Set all your gears' cooldowns to @{pactCost}"])
	.setModifiers({ name: "Distraction", stacks: 0 })
	.setScalings({
		damage: damageScalingGenerator(200),
		critBonus: 2,
		percentCritRate: 10
	});
