const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Overburn Explosion",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and all foes with @{mod0}"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Pact",
	"Fire"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [targetModifier], scalings: { damage, critBonus }, pactCost } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);
		if (user.essence === essence) {
			changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const resultLines = dealDamage(allTargets, user, pendingDamage, false, essence, adventure);
		if (user.gear) {
			for (const gear of user.gear) {
				gear.cooldown += pactCost[0];
			}
			resultLines.push(`${user.name} is burnt out.`);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Accurate Overburn Explosion", "Unstoppable Overburn Explosion")
	.setPactCost([2, "Set all your gears' cooldowns to @{pactCost}"])
	.setModifiers({ name: "Distraction", stacks: 0 })
	.setScalings({
		damage: damageScalingGenerator(200),
		critBonus: 2
	});
