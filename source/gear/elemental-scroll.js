const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');

//#region Base
const elementalScroll = new GearTemplate("Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} to an ally and allies with @{mod1}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Support",
	"Fire"
).setCost(200)
	.setEffect(elementalScrollEffect, { type: `single${SAFE_DELIMITER}Vigilance`, team: "ally" })
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof elementalScroll.effect} */
function elementalScrollEffect(targets, user, adventure) {
	const { essence, modifiers: [attunement], scalings: { critBonus } } = elementalScroll;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		pendingAttunement.stacks *= critBonus;
	}
	return addModifier(targets, pendingAttunement);
}
//#endregion Base

//#region Balanced
const balancedElementalScroll = new GearTemplate("Balanced Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally and allies with @{mod2}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Support",
	"Fire"
).setCost(350)
	.setEffect(balancedElementalScrollEffect, { type: `single${SAFE_DELIMITER}Vigilance`, team: "ally" })
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Finesse", stacks: 1 }, { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof balancedElementalScroll.effect} */
function balancedElementalScrollEffect(targets, user, adventure) {
	const { essence, modifiers: [attunement, finesse], scalings: { critBonus } } = balancedElementalScroll;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		pendingAttunement.stacks *= critBonus;
	}
	return addModifier(targets, pendingAttunement).concat(addModifier(targets, finesse));
}
//#endregion Balanced

//#region Surpassing
const surpassingElementalScroll = new GearTemplate("Surpassing Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally and allies with @{mod2}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Support",
	"Fire"
).setCost(350)
	.setEffect(surpassingElementalScrollEffect, { type: `single${SAFE_DELIMITER}Vigilance`, team: "ally" })
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Excellence", stacks: 2 }, { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof surpassingElementalScroll.effect} */
function surpassingElementalScrollEffect(targets, user, adventure) {
	const { essence, modifiers: [attunement, excellence], scalings: { critBonus } } = surpassingElementalScroll;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingAttunement = { ...attunement };
	if (user.crit) {
		pendingAttunement.stacks *= critBonus;
	}
	return addModifier(targets, pendingAttunement).concat(addModifier(targets, excellence));
}
//#endregion Surpassing

module.exports = new GearFamily(elementalScroll, [balancedElementalScroll, surpassingElementalScroll], false);
