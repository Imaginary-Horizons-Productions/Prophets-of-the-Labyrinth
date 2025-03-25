const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { scalingDistraction } = require('./shared/modifiers');

//#region Base
const windBurst = new GearTemplate("Wind Burst",
	[
		["use", "Inflict <@{mod0Stacks}> @{mod0} on a foe"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(200)
	.setEffect(windBurstEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setModifiers(scalingDistraction(2))
	.setScalings({ critBonus: 2 });

/** @type {typeof windBurst.effect} */
function windBurstEffect(targets, user, adventure) {
	const { essence, modifiers: [distraction], scalings: { critBonus } } = windBurst;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingDistraction = { name: distraction.name, stacks: distraction.stacks.calculate(user) };
	if (user.crit) {
		pendingDistraction.stacks *= critBonus;
	}
	return generateModifierResultLines(addModifier(targets, pendingDistraction));
}
//#endregion Base

//#region Inspiring
const inspiringWindBurst = new GearTemplate("Inspiring Wind Burst",
	[
		["use", "Inflict <@{mod0Stacks}> @{mod0} on a foe and increase party's morale by @{morale}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(350)
	.setEffect(inspiringWindBurstEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setModifiers(scalingDistraction(2))
	.setScalings({
		critBonus: 2,
		morale: 1
	});

/** @type {typeof inspiringWindBurst.effect} */
function inspiringWindBurstEffect(targets, user, adventure) {
	const { essence, modifiers: [distraction], scalings: { critBonus, morale } } = inspiringWindBurst;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingDistraction = { name: distraction.name, stacks: distraction.stacks.calculate(user) };
	if (user.crit) {
		pendingDistraction.stacks *= critBonus;
	}
	adventure.room.morale += morale;
	return generateModifierResultLines(addModifier(targets, pendingDistraction)).concat("The party's morale is increased!");
}
//#endregion

//#region Toxic
const toxicWindBurst = new GearTemplate("Toxic Wind Burst",
	[
		["use", "Inflict <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1} on a foe"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(350)
	.setEffect(toxicWindBurstEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setModifiers(scalingDistraction(2), { name: "Poison", stacks: 3 })
	.setScalings({ critBonus: 2 });

/** @type {typeof toxicWindBurst.effect} */
function toxicWindBurstEffect(targets, user, adventure) {
	const { essence, modifiers: [distraction, poison], scalings: { critBonus } } = toxicWindBurst;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingDistraction = { name: distraction.name, stacks: distraction.stacks.calculate(user) };
	if (user.crit) {
		pendingDistraction.stacks *= critBonus;
	}
	return generateModifierResultLines(addModifier(targets, pendingDistraction).concat(addModifier(targets, poison)));
}
//#endregion Toxic

module.exports = new GearFamily(windBurst, [inspiringWindBurst, toxicWindBurst], false);
