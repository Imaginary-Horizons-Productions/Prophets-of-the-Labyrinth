const { GearTemplate, GearFamily } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');

const bounces = 3;

//#region Base
const smokescreen = new GearTemplate("Smokescreen",
	[
		["use", "Grant @{bounces} random allies <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Earth"
).setCost(200)
	.setEffect(smokescreenEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "ally" })
	.setCooldown(1)
	.setRnConfig({ allies: bounces })
	.setModifiers(scalingEvasion(2))
	.setScalings({ critBonus: 2, bounces });

/** @type {typeof smokescreen.effect} */
function smokescreenEffect(targets, user, adventure) {
	const { essence, modifiers: [evasion], scalings: { critBonus } } = smokescreen;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
	if (user.crit) {
		pendingEvasion.stacks *= critBonus;
	}
	return addModifier(targets, pendingEvasion);
}
//#endregion Base

//#region Chaining
const chainingSmokescreen = new GearTemplate("Chaining Smokescreen",
	[
		["use", "Grant @{bounces} random allies <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Earth"
).setCost(350)
	.setEffect(smokescreenEffect, { type: `random${SAFE_DELIMITER}${bounces}`, team: "ally" })
	.setCooldown(0)
	.setRnConfig({ allies: bounces })
	.setModifiers(scalingEvasion(2))
	.setScalings({ critBonus: 2, bounces });
//#endregion Chaining

//#region Double
const doubleBounces = 6;
const doubleSmokescreen = new GearTemplate("Double Smokescreen",
	[
		["use", "Grant @{bounces} random allies <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Earth"
).setCost(350)
	.setEffect(doubleSmokescreenEffect, { type: `random${SAFE_DELIMITER}${doubleBounces}`, team: "ally" })
	.setCooldown(1)
	.setRnConfig({ allies: doubleBounces })
	.setModifiers(scalingEvasion(1))
	.setScalings({ critBonus: 2, bounces: doubleBounces });

/** @type {typeof doubleSmokescreen.effect} */
function doubleSmokescreenEffect(targets, user, adventure) {
	const { essence, modifiers: [evasion], scalings: { critBonus } } = doubleSmokescreen;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
	if (user.crit) {
		pendingEvasion.stacks *= critBonus;
	}
	return addModifier(targets, pendingEvasion);
}
//#endregion Double

module.exports = new GearFamily(smokescreen, [chainingSmokescreen, doubleSmokescreen], false);
