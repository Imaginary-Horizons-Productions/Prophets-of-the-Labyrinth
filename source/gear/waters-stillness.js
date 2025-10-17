const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { scalingSwiftness } = require('./shared/modifiers');

//#region Base
const watersStillness = new GearTemplate("Water's Stillness",
	[
		["use", "Relieve Stagger for an ally and all allies with @{mod0}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(200)
	.setEffect(watersStillnessEffect, { type: `single${SAFE_DELIMITER}Vigilance`, team: "ally" })
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof watersStillness.effect} */
function watersStillnessEffect(targets, user, adventure) {
	const { essence, stagger, scalings: { critBonus } } = watersStillness;
	let pendingStaggerRelief = stagger;
	if (user.essence === essence) {
		pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
	}
	if (user.crit) {
		pendingStaggerRelief *= critBonus;
	}
	return changeStagger(targets, user, pendingStaggerRelief);
}
//#endregion Base

//#region Accelerating
const acceleratingWatersStillness = new GearTemplate("Accelerating Water's Stillness",
	[
		["use", "Relieve Stagger and grant <@{mod0Stacks}> @{mod0} to an ally and all allies with @{mod1}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect(acceleratingWatersStillnessEffect, { type: `single${SAFE_DELIMITER}Vigilance`, team: "ally" })
	.setCharges(15)
	.setStagger(-2)
	.setModifiers(scalingSwiftness(2), { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof acceleratingWatersStillness.effect} */
function acceleratingWatersStillnessEffect(targets, user, adventure) {
	const { essence, modifiers: [swiftness], stagger, scalings: { critBonus } } = acceleratingWatersStillness;
	let pendingStaggerRelief = stagger;
	if (user.essence === essence) {
		pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
	}
	if (user.crit) {
		pendingStaggerRelief *= critBonus;
	}
	return changeStagger(targets, user, pendingStaggerRelief).concat(addModifier(targets, { name: swiftness.name, stacks: swiftness.stacks.calculate(user) }));
}
//#endregion Accelerating

//#region Cleansing
const variantName = "Cleansing Water's Stillness";
const cleansingWatersStillness = new GearTemplate("Cleansing Water's Stillness",
	[
		["use", "Relieve Stagger and cure @{debuffsCured} random debuff for an ally and all allies with @{mod0}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect(cleansingWatersStillnessEffect, { type: `single${SAFE_DELIMITER}Vigilance`, team: "ally" })
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 })
	.setScalings({
		debuffsCured: 1,
		critBonus: 2
	})
	.setRnConfig({ debuffs: 1 });

/** @type {typeof cleansingWatersStillness.effect} */
function cleansingWatersStillnessEffect(targets, user, adventure) {
	const { essence, stagger, scalings: { debuffsCured, critBonus } } = cleansingWatersStillness;
	let pendingStaggerRelief = stagger;
	if (user.essence === essence) {
		pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
	}
	if (user.crit) {
		pendingStaggerRelief *= critBonus;
	}
	const results = changeStagger(targets, user, pendingStaggerRelief);
	for (const target of targets) {
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const debuffsToRemove = Math.min(targetDebuffs.length, debuffsCured);
		for (let i = 0; i < debuffsToRemove; i++) {
			const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
			results.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
		}
	}
	return results;
}
//#endregion Cleansing

module.exports = new GearFamily(watersStillness, [acceleratingWatersStillness, cleansingWatersStillness], false);
