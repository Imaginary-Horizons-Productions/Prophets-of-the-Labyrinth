const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingTorpidity } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}; inflict @{mod0} on all foes instead"]
	],
	"Offense",
	"Light"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [torpidity] } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let torpidityTargets = survivors;
		if (user.crit) {
			if (user.team === "delver") {
				torpidityTargets = adventure.room.enemies.filter(target => target.hp > 0);
			} else {
				torpidityTargets = adventure.delvers;
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(torpidityTargets, { name: torpidity.name, stacks: torpidity.stacks.calculate(user) }))));
	}, { type: "single", team: "foe" })
	.setUpgrades("Tormenting Net Launcher", "Thief's Net Launcher")
	.setCooldown(1)
	.setScalings({ damage: damageScalingGenerator(40), critBonus: 2 })
	.setModifiers(scalingTorpidity(3));
