const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { discountedPassive } = require('./shared/passiveDescriptions');

//#region Base
const midasStaff = new GearTemplate("Midas Staff",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a combatant"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Light"
).setCost(200)
	.setEffect(midasStaffEffect, { type: "single", team: "any" })
	.setCooldown(1)
	.setModifiers({ name: "Curse of Midas", stacks: 2 })
	.setScalings({ critBonus: 1 });

/** @type {typeof midasStaff.effect} */
function midasStaffEffect(targets, user, adventure) {
	const { essence, modifiers: [curseOfMidas], scalings: { critBonus } } = midasStaff;
	if (user.essence === essence) {
		changeStagger(targets, user, targets[0].team === user.team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingCurse = { ...curseOfMidas };
	if (user.crit) {
		pendingCurse.stacks += critBonus;
	}
	return addModifier(targets, pendingCurse);
}
//#endregion Base

//#region Accelerating
const acceleratingMidasStaff = new GearTemplate("Accelerating Midas Staff",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to a combatant"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Light"
).setCost(350)
	.setEffect(acceleratingMidasStaffEffect, { type: "single", team: "any" })
	.setCooldown(1)
	.setModifiers({ name: "Curse of Midas", stacks: 2 }, { name: "Swiftness", stacks: 3 })
	.setScalings({ critBonus: 1 });

/** @type {typeof acceleratingMidasStaff.effect} */
function acceleratingMidasStaffEffect(targets, user, adventure) {
	const { essence, modifiers: [curseOfMidas, swiftness], scalings: { critBonus } } = acceleratingMidasStaff;
	if (user.essence === essence) {
		changeStagger(targets, user, targets[0].team === user.team ? ESSENCE_MATCH_STAGGER_ALLY : ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingCurse = { ...curseOfMidas };
	if (user.crit) {
		pendingCurse.stacks += critBonus;
	}
	return addModifier(targets, pendingCurse).concat(addModifier(targets, swiftness));
}
//#endregion Accelerating

//#region Discounted
const discountedMidasStaff = new GearTemplate("Discounted Midas Staff",
	[
		discountedPassive,
		["use", "Inflict @{mod0Stacks} @{mod0} on a combatant"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Light"
).setCost(100)
	.setEffect(midasStaffEffect, { type: "single", team: "any" })
	.setCooldown(1)
	.setModifiers({ name: "Curse of Midas", stacks: 2 })
	.setScalings({ critBonus: 1 });
//#endregion Discounted

module.exports = new GearFamily(midasStaff, [acceleratingMidasStaff, discountedMidasStaff], false);
