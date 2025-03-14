const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { removeModifier, dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const actionName = "Convalescence Stick";
module.exports = new GearTemplate(actionName,
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, then shrug off @{debuffsCured} random debuff"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const receipts = addModifier(survivors, impotence);
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	receipts.push(...removeModifier([user], { name: userDebuffs[user.roundRns[`${actionName}${SAFE_DELIMITER}debuffs`][0] % userDebuffs.length], stacks: "all" }));
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
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
