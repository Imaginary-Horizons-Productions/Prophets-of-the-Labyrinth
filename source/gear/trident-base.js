const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, removeModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

const variantName = "Trident";
module.exports = new GearTemplate(variantName,
	[
		["use", "Inflict <@{damage}> @{essence} damage on a foe, then shrug off @{debuffsCured} random debuff"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Offense",
	"Water"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus } } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			const stillLivingTargets = targets.filter(target => target.hp > 0);
			changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		return resultLines.concat(generateModifierResultLines(removeModifier([user], { name: userDebuffs[user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" })));
	}, { type: "single", team: "foe" })
	.setUpgrades("Kinetic Trident", "Staggering Trident")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		debuffsCured: 1
	})
	.setRnConfig({ debuffs: 1 });
