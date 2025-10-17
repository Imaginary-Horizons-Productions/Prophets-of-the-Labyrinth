const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');
const { accuratePassive, powerfulPassive } = require('./shared/passiveDescriptions');

//#region Base
const cloak = new GearTemplate("Cloak",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Fire"
).setCost(200)
	.setEffect(cloakEffect, { type: "self", team: "ally" })
	.setCooldown(1)
	.setModifiers(scalingEvasion(2))
	.setScalings({ critBonus: 2 });

/** @type {typeof cloak.effect} */
function cloakEffect(targets, user, adventure) {
	const { essence, modifiers: [evasion], scalings: { critBonus } } = cloak;
	if (user.essence === essence) {
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
	if (user.crit) {
		pendingEvasion.stacks *= critBonus;
	}
	return addModifier([user], pendingEvasion);
}
//#endregion Base

//#region Accurate
const accurateCloak = new GearTemplate("Accurate Cloak",
	[
		accuratePassive,
		["use", "Gain <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Fire"
).setCost(350)
	.setEffect(cloakEffect, { type: "self", team: "ally" })
	.setCooldown(1)
	.setModifiers(scalingEvasion(2))
	.setScalings({
		critBonus: 2,
		percentCritRate: 10
	});
//#endregion Accurate

//#region Powerful
const powerfulCloak = new GearTemplate("Powerful Cloak",
	[
		powerfulPassive,
		["use", "Gain <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Fire"
).setCost(350)
	.setEffect(cloakEffect, { type: "self", team: "ally" })
	.setCooldown(1)
	.setModifiers(scalingEvasion(2))
	.setScalings({
		critBonus: 2,
		percentPower: 10
	});
//#endregion Powerful

module.exports = new GearFamily(cloak, [accurateCloak, powerfulCloak], false);
