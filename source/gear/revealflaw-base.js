const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { essenceList } = require('../util/essenceUtil');
const { joinAsStatement } = require('../util/textUtil');

const gearName = "Reveal Flaw";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict @{mod0Stacks} Vulnerability to a random essence on all foes"],
		["Critical💥", "Inflict @{critMultiplier} extra Stagger"]
	],
	"Maneuver",
	"Light",
	200,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, modifiers: [vulnerability], critMultiplier } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		const essencePool = essenceList(["Unaligned"]);
		const selectedEsesnce = essencePool[user.roundRns[`${gearName}${SAFE_DELIMITER}vulnerabilities`][0] % 6];
		const resultLines = generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: `${selectedEsesnce} Vulnerability`, stacks: vulnerability.stacks })));
		let pendingStagger = 0;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingStagger += critMultiplier;
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
		}
		if (pendingStagger > 0) {
			changeStagger(targets, user, pendingStagger);
		}
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "foe" })
	.setUpgrades("Distracting Reveal Flaw", "Numbing Reveal Flaw")
	.setMoraleRequirement(1)
	.setModifiers({ name: "unparsed random vulnerability", stacks: 2 })
	.setRnConfig({ vulnerabilities: 1 });
