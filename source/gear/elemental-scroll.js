const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, concatTeamMembersWithModifier, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

//#region Base
const elementalScroll = new GearTemplate("Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} to an ally and allies with @{mod1}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Support",
	"Fire"
).setCost(200)
	.setEffect(elementalScrollEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof elementalScroll.effect} */
function elementalScrollEffect(targets, user, adventure) {
	const { essence, modifiers: [attunement, vigilance], scalings: { critBonus } } = elementalScroll;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, vigilance.name);
	if (user.essence === essence) {
		changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		pendingAttunement.stacks *= critBonus;
	}
	return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingAttunement)));
}
//#endregion Base

//#region Balanced
const balancedElementalScroll = new GearTemplate("Balanced Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod2Stacks} @{mod2} to an ally and allies with @{mod1}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Support",
	"Fire"
).setCost(350)
	.setEffect(balancedElementalScrollEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Vigilance", stacks: 0 }, { name: "Finesse", stacks: 1 })
	.setScalings({ critBonus: 2 });

/** @type {typeof balancedElementalScroll.effect} */
function balancedElementalScrollEffect(targets, user, adventure) {
	const { essence, modifiers: [attunement, vigilance, finesse], scalings: { critBonus } } = balancedElementalScroll;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, vigilance.name);
	if (user.essence === essence) {
		changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		pendingAttunement.stacks *= critBonus;
	}
	return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingAttunement).concat(addModifier(allTargets, finesse))));
}
//#endregion Balanced

//#region Surpassing
const surpassingElementalScroll = new GearTemplate("Surpassing Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod2Stacks} @{mod2} to an ally and allies with @{mod1}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Support",
	"Fire"
).setCost(350)
	.setEffect(surpassingElementalScrollEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Vigilance", stacks: 0 }, { name: "Excellence", stacks: 2 })
	.setScalings({ critBonus: 2 });

/** @type {typeof surpassingElementalScroll.effect} */
function surpassingElementalScrollEffect(targets, user, adventure) {
	const { essence, modifiers: [attunement, vigilance, excellence], scalings: { critBonus } } = surpassingElementalScroll;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, vigilance.name);
	if (user.essence === essence) {
		changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		pendingAttunement.stacks *= critBonus;
	}
	return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingAttunement).concat(addModifier(allTargets, excellence))));
}
//#endregion Surpassing

module.exports = new GearFamily(elementalScroll, [balancedElementalScroll, surpassingElementalScroll], false);
