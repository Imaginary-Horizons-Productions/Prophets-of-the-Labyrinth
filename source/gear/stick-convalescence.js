const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { removeModifier, dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const actionName = "Convalescence Stick";
module.exports = new GearTemplate(actionName,
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, then shrug off @{debuffsCured} random debuff"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	const reciepts = addModifier(stillLivingTargets, impotence);
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	reciepts.push(...removeModifier([user], { name: userDebuffs[user.roundRns[`${actionName}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" }));
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		debuffsCured: 1
	})
	.setModifiers({ name: "Impotence", stacks: 3 })
	.setRnConfig({
		debuffs: 1
	});
