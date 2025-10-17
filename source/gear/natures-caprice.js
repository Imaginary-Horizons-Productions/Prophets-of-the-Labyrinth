const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { accuratePassive, heartyPassive } = require('./shared/passiveDescriptions');

//#region Base
const naturesCaprice = new GearTemplate("Nature's Caprice",
	[
		["use", "Grant @{mod0Stacks} @{mod0} to a combatant"],
		["critical", "Instead inflict @{mod1Stacks} @{mod1}"]
	],
	"Spell",
	"Earth"
).setCost(200)
	.setEffect(naturesCapriceEffect, { type: "single", team: "any" })
	.setCharges(15)
	.setModifiers({ name: "Fortune", stacks: 9 }, { name: "Misfortune", stacks: 9 });

/** @type {typeof naturesCaprice.effect} */
function naturesCapriceEffect(targets, user, adventure) {
	const { essence, modifiers: [fortune, misfortune] } = naturesCaprice;
	if (user.essence === essence) {
		changeStagger(targets, user, user.team === targets[0].team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.crit) {
		return addModifier(targets, misfortune);
	} else {
		return addModifier(targets, fortune);
	}
}
//#region Base

//#region Accurate
const accurateNaturesCaprice = new GearTemplate("Accurate Nature's Caprice",
	[
		accuratePassive,
		["use", "Grant @{mod0Stacks} @{mod0} to a combatant"],
		["critical", "Instead inflict @{mod1Stacks} @{mod1}"]
	],
	"Spell",
	"Earth"
).setCost(350)
	.setEffect(naturesCapriceEffect, { type: "single", team: "any" })
	.setCharges(15)
	.setModifiers({ name: "Fortune", stacks: 9 }, { name: "Misfortune", stacks: 9 })
	.setScalings({ percentCritRate: 10 });
//#endregion Accurate

//#region Hearty
const heartyNaturesCaprice = new GearTemplate("Hearty Nature's Caprice",
	[
		heartyPassive,
		["use", "Grant @{mod0Stacks} @{mod0} to a combatant"],
		["critical", "Instead inflict @{mod1Stacks} @{mod1}"]
	],
	"Spell",
	"Earth"
).setCost(350)
	.setEffect(naturesCapriceEffect, { type: "single", team: "any" })
	.setCharges(15)
	.setModifiers({ name: "Fortune", stacks: 9 }, { name: "Misfortune", stacks: 9 })
	.setScalings({ percentMaxHP: 10 });
//#endregion Hearty

module.exports = new GearFamily(naturesCaprice, [accurateNaturesCaprice, heartyNaturesCaprice], false);
