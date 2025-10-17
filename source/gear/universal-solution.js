const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, addModifier, removeModifier } = require('../util/combatantUtil');

const debuffsTransferred = 2;
const poisonStacks = 3;

//#region Base
const universalSolution = new GearTemplate("Universal Solution",
	[
		["use", "Transfer a random @{debuffsTransferred} of your debuffs to a foe"],
		["critical", "Transfer all of your debuffs"]
	],
	"Pact",
	"Water"
).setCost(200)
	.setEffect(universalSolutionEffect, { type: "single", team: "foe" })
	.setPactCost([poisonStacks, "Gain @{pactCost} @e{Poison} afterwards"])
	.setScalings({
		debuffsTransferred
	})
	.setModifiers({ name: "Poison", stacks: poisonStacks })
	.setRnConfig({ debuffs: debuffsTransferred });

/** @type {typeof universalSolution.effect} */
function universalSolutionEffect(targets, user, adventure) {
	const { essence, scalings: { debuffsTransferred }, modifiers: [poison] } = universalSolution;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	const results = [];
	if (user.crit) {
		for (const debuff of userDebuffs) {
			results.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
			results.push(...removeModifier([user], { name: debuff, stacks: "all" }));
		}
	} else {
		for (let i = 0; i < debuffsTransferred; i++) {
			const [debuff] = userDebuffs.splice(user.roundRns[`${universalSolution.name}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length, 1);
			results.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
			results.push(...removeModifier([user], { name: debuff, stacks: "all" }));
		}
	}
	return results.concat(addModifier([user], poison));
}
//#endregion Base

//#region Centering
const centeringUniversalSolution = new GearTemplate("Centering Universal Solution",
	[
		["use", "Transfer a random @{debuffsTransferred} of your debuffs to a foe and shrug off @{staggerRelief} Stagger"],
		["critical", "Transfer all of your debuffs"]
	],
	"Pact",
	"Water"
).setCost(350)
	.setEffect(centeringUniversalSolutionEffect, { type: "single", team: "foe" })
	.setPactCost([poisonStacks, "Gain @{pactCost} @e{Poison} afterwards"])
	.setScalings({
		debuffsTransferred,
		staggerRelief: 2
	})
	.setModifiers({ name: "Poison", stacks: poisonStacks })
	.setRnConfig({ debuffs: debuffsTransferred });

/** @type {typeof centeringUniversalSolution.effect} */
function centeringUniversalSolutionEffect(targets, user, adventure) {
	const { essence, scalings: { debuffsTransferred, staggerRelief }, modifiers: [poison] } = centeringUniversalSolution;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	const results = [];
	if (user.crit) {
		for (const debuff of userDebuffs) {
			results.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
			results.push(...removeModifier([user], { name: debuff, stacks: "all" }));
		}
	} else {
		for (let i = 0; i < debuffsTransferred; i++) {
			const [debuff] = userDebuffs.splice(user.roundRns[`${centeringUniversalSolution.name}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length, 1);
			results.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
			results.push(...removeModifier([user], { name: debuff, stacks: "all" }));
		}
	}
	return results.concat(addModifier([user], poison), changeStagger([user], user, staggerRelief));
}
//#endregion Centering

//#region Tormenting
const tormentingUniversalSolution = new GearTemplate("Tormenting Universal Solution",
	[
		["use", "Transfer a random @{debuffsTransferred} of your debuffs to a foe then add @{debuffIncrement} stack to each of their debuffs"],
		["critical", "Transfer all of your debuffs"]
	],
	"Pact",
	"Water"
).setCost(350)
	.setEffect(tormentingUniversalSolutionEffect, { type: "single", team: "foe" })
	.setPactCost([poisonStacks, "Gain @{pactCost} @e{Poison} afterwards"])
	.setScalings({
		debuffsTransferred,
		debuffIncrement: 1
	})
	.setModifiers({ name: "Poison", stacks: poisonStacks })
	.setRnConfig({ debuffs: debuffsTransferred });

/** @type {typeof tormentingUniversalSolution.effect} */
function tormentingUniversalSolutionEffect(targets, user, adventure) {
	const { essence, scalings: { debuffsTransferred, debuffIncrement }, modifiers: [poison] } = tormentingUniversalSolution;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
	const results = [];
	if (user.crit) {
		for (const debuff of userDebuffs) {
			results.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
			results.push(...removeModifier([user], { name: debuff, stacks: "all" }));
		}
	} else {
		for (let i = 0; i < debuffsTransferred; i++) {
			const [debuff] = userDebuffs.splice(user.roundRns[`${tormentingUniversalSolution.name}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length, 1);
			results.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
			results.push(...removeModifier([user], { name: debuff, stacks: "all" }));
		}
	}
	for (const target of targets) {
		for (const modifier in target.modifiers) {
			if (getModifierCategory(modifier) === "Debuff") {
				results.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
			}
		}
	}
	return results.concat(addModifier([user], poison));
}
//#endregion Tormenting

module.exports = new GearFamily(universalSolution, [centeringUniversalSolution, tormentingUniversalSolution], false);
