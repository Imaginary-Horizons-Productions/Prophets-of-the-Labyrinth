const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { removeModifier, dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');

const actionName = "Convalescence Stick";
module.exports = new GearTemplate(actionName,
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a single foe, then shrug off @{bonus} random debuff"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Earth",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [impotence] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		const reciepts = addModifier(stillLivingTargets, impotence);
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		reciepts.push(...removeModifier([user], { name: userDebuffs[user.roundRns[`${actionName}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" }));
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Impotence", stacks: 3 })
	.setBonus(1)
	.setRnConfig({
		debuffs: 1
	});
