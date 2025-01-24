const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { essenceList } = require('../util/essenceUtil');
const { joinAsStatement } = require('../util/textUtil');

const variantName = "Numbing Reveal Flaw";
module.exports = new GearTemplate(variantName,
	[
		["use", "Inflict @{mod0Stacks} Vulnerability to a random essence on all foes"],
		["Critical💥", "Inflict @{critBonus} extra Stagger"]
	],
	"Maneuver",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, modifiers: [vulnerability, clumsiness], scalings: { critBonus } } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
		}

		const essencePool = essenceList(["Unaligned"]);
		const selectedEsesnce = essencePool[user.roundRns[`${variantName}${SAFE_DELIMITER}vulnerabilities`][0] % 6];
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
	}, { type: "all", team: "foe" })
	.setSidegrades("Distracting Reveal Flaw")
	.setMoraleRequirement(1)
	.setModifiers({ name: "unparsed random vulnerability", stacks: 2 }, { name: "Clumsiness", stacks: 1 })
	.setRnConfig({ vulnerabilities: 1 })
	.setScalings({ critBonus: 2 });
