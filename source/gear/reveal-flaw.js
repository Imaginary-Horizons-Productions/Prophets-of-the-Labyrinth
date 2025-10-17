const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { essenceList } = require('../util/essenceUtil');

//#region Base
const revealFlaw = new GearTemplate("Reveal Flaw",
	[
		["use", "Inflict @{mod0Stacks} Vulnerability to a random essence on all foes"],
		["critical", "Inflict @{critBonus} extra Stagger"]
	],
	"Maneuver",
	"Light"
).setCost(200)
	.setEffect(revealFlawEffect, { type: "all", team: "foe" })
	.setMoraleRequirement(1)
	.setModifiers({ name: "unparsed random vulnerability", stacks: 2 })
	.setRnConfig({ vulnerabilities: 1 })
	.setScalings({ critBonus: 2 });

/** @type {typeof revealFlaw.effect} */
function revealFlawEffect(targets, user, adventure) {
	const { essence, moraleRequirement, modifiers: [vulnerability], scalings: { critBonus } } = revealFlaw;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	const essencePool = essenceList(["Unaligned"]);
	const selectedEsesnce = essencePool[user.roundRns[`${revealFlaw.name}${SAFE_DELIMITER}vulnerabilities`][0] % 6];
	const results = addModifier(targets, { name: `${selectedEsesnce} Vulnerability`, stacks: vulnerability.stacks });
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.crit) {
		results.push(changeStagger(targets, user, critBonus));
	}
	return results;
}
//#endregion Base

//#region Distracting
const distractingRevealFlaw = new GearTemplate("Distracting Reveal Flaw",
	[
		["use", "Inflict @{mod0Stacks} Vulnerability to a random essence on all foes"],
		["critical", "Inflict @{critBonus} extra Stagger"]
	],
	"Maneuver",
	"Light"
).setCost(350)
	.setEffect(distractingRevealFlawEffect, { type: "all", team: "foe" })
	.setMoraleRequirement(1)
	.setModifiers({ name: "unparsed random vulnerability", stacks: 2 }, { name: "Distraction", stacks: 2 })
	.setRnConfig({ vulnerabilities: 1 })
	.setScalings({ critBonus: 2 });

/** @type {typeof distractingRevealFlaw.effect} */
function distractingRevealFlawEffect(targets, user, adventure) {
	const { essence, moraleRequirement, modifiers: [vulnerability, distraction], scalings: { critBonus } } = distractingRevealFlaw;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	const essencePool = essenceList(["Unaligned"]);
	const selectedEsesnce = essencePool[user.roundRns[`${distractingRevealFlaw.name}${SAFE_DELIMITER}vulnerabilities`][0] % 6];
	const results = addModifier(targets, { name: `${selectedEsesnce} Vulnerability`, stacks: vulnerability.stacks });
	results.push(...addModifier(targets, distraction));
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.crit) {
		results.push(changeStagger(targets, user, critBonus));
	}
	return results;
}
//#endregion Distracting

//#region Numbing
const numbingRevealFlaw = new GearTemplate("Numbing Reveal Flaw",
	[
		["use", "Inflict @{mod0Stacks} Vulnerability to a random essence on all foes"],
		["critical", "Inflict @{critBonus} extra Stagger"]
	],
	"Maneuver",
	"Light"
).setCost(350)
	.setEffect(numbingRevealFlawEffect, { type: "all", team: "foe" })
	.setMoraleRequirement(1)
	.setModifiers({ name: "unparsed random vulnerability", stacks: 2 }, { name: "Clumsiness", stacks: 1 })
	.setRnConfig({ vulnerabilities: 1 })
	.setScalings({ critBonus: 2 });

/** @type {typeof numbingRevealFlaw.effect} */
function numbingRevealFlawEffect(targets, user, adventure) {
	const { essence, moraleRequirement, modifiers: [vulnerability, clumsiness], scalings: { critBonus } } = module.exports;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	const essencePool = essenceList(["Unaligned"]);
	const selectedEsesnce = essencePool[user.roundRns[`${numbingRevealFlaw.name}${SAFE_DELIMITER}vulnerabilities`][0] % 6];
	const results = addModifier(targets, { name: `${selectedEsesnce} Vulnerability`, stacks: vulnerability.stacks });
	results.push(...addModifier(targets, clumsiness));
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.crit) {
		results.push(changeStagger(targets, user, critBonus));
	}
	return results;
}
//#endregion Numbing

module.exports = new GearFamily(revealFlaw, [distractingRevealFlaw, numbingRevealFlaw], false);
