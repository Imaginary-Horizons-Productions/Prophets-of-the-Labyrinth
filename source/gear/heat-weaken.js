const { GearTemplate, GearFamily } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');

const bounces = 3;

//#region Base
const heatWeaken = new GearTemplate("Heat Weaken",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on @{bounces} random foes"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(200)
	.setEffect(heatWeakenEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setCharges(15)
	.setModifiers({ name: "Frailty", stacks: 2 })
	.setScalings({ critBonus: 2, bounces })
	.setRnConfig({ foes: bounces });

/** @type {typeof heatWeaken.effect} */
function heatWeakenEffect(targets, user, adventure) {
	const { essence, modifiers: [frailty], scalings: { critBonus } } = heatWeaken;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingFrailty = { ...frailty };
	if (user.crit) {
		pendingFrailty.stacks *= critBonus;
	}
	return addModifier(targets, pendingFrailty);
}
//#endregion Base

//#region Numbing
const numbingHeatWeaken = new GearTemplate("Numbing Heat Weaken",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on @{bounces} random foes"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(350)
	.setEffect(numbingHeatWeakenEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setCharges(15)
	.setModifiers({ name: "Frailty", stacks: 2 }, { name: "Clumsiness", stacks: 1 })
	.setScalings({ critBonus: 2, bounces })
	.setRnConfig({ foes: bounces });

/** @type {typeof numbingHeatWeaken.effect} */
function numbingHeatWeakenEffect(targets, user, adventure) {
	const { essence, modifiers: [frailty, clumsiness], scalings: { critBonus } } = numbingHeatWeaken;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingFrailty = { ...frailty };
	if (user.crit) {
		pendingFrailty.stacks *= critBonus;
	}
	return addModifier(targets, pendingFrailty).concat(addModifier(targets, clumsiness));
}
//#endregion Numbing

//#region Staggering
const staggeringHeatWeaken = new GearTemplate("Staggering Heat Weaken",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on @{bounces} random foes"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(350)
	.setEffect(staggeringHeatWeakenEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setCharges(15)
	.setModifiers({ name: "Frailty", stacks: 2 })
	.setStagger(2)
	.setScalings({ critBonus: 2, bounces })
	.setRnConfig({ foes: bounces });

/** @type {typeof staggeringHeatWeaken.effect} */
function staggeringHeatWeakenEffect(targets, user, adventure) {
	const { essence, modifiers: [frailty], scalings: { critBonus }, stagger } = staggeringHeatWeaken;
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	const pendingFrailty = { ...frailty };
	if (user.crit) {
		pendingFrailty.stacks *= critBonus;
	}
	return addModifier(targets, pendingFrailty).concat(changeStagger(targets, user, pendingStagger));
}
//#endregion Staggering

module.exports = new GearFamily(heatWeaken, [numbingHeatWeaken, staggeringHeatWeaken], false);
