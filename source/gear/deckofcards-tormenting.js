const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const actionName = "Tormenting Deck of Cards";
module.exports = new GearTemplate(actionName,
	[
		["use", "Deal <@{damage}> @{essence} damage, increase debuff stacks by @{debuffIncrement}, and inflict <@{mod0Stacks}> @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, debuffIncrement }, modifiers: [misfortune] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	const reciepts = [];
	for (const target of targets) {
		for (const modifier in target.modifiers) {
			if (getModifierCategory(modifier) === "Debuff") {
				reciepts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
			}
		}
	}
	reciepts.push(...addModifier(stillLivingTargets, { name: misfortune.name, stacks: 2 + user.roundRns[`${actionName}${SAFE_DELIMITER}Deck of Cards`][0] }));
	return resultLines.concat(generateModifierResultLines(reciepts));
}, { type: "single", team: "foe" })
	.setModifiers({ name: "Misfortune", stacks: { description: "a random amount between 2 and 9", calculate: (user) => 2 + user.roundRns[`${actionName}${SAFE_DELIMITER}Deck of Cards`][0] } })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		debuffIncrement: 1
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });
