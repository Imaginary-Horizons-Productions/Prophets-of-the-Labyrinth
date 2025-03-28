const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { essenceList } = require('../util/essenceUtil');
const { joinAsStatement } = require('../util/textUtil');

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
	const resultLines = generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: `${selectedEsesnce} Vulnerability`, stacks: vulnerability.stacks })));
	let pendingStagger = 0;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger += critBonus;
		resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
	}
	if (pendingStagger > 0) {
		changeStagger(targets, user, pendingStagger);
	}
	return resultLines;
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
	const receipts = addModifier(targets, { name: `${selectedEsesnce} Vulnerability`, stacks: vulnerability.stacks });
	receipts.push(...addModifier(targets, distraction));
	const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
	let pendingStagger = 0;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger += critBonus;
		resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
	}
	if (pendingStagger > 0) {
		changeStagger(targets, user, pendingStagger);
	}
	return resultLines;
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
	const receipts = addModifier(targets, { name: `${selectedEsesnce} Vulnerability`, stacks: vulnerability.stacks });
	receipts.push(...addModifier(targets, clumsiness));
	const resultLines = generateModifierResultLines(combineModifierReceipts(receipts));
	let pendingStagger = 0;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger += critBonus;
		resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
	}
	if (pendingStagger > 0) {
		changeStagger(targets, user, pendingStagger);
	}
	return resultLines;
}
//#endregion Numbing

module.exports = new GearFamily(revealFlaw, [distractingRevealFlaw, numbingRevealFlaw], false);
