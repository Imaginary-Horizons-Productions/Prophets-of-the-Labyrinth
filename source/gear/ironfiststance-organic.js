const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Organic Iron Fist Stance",
	"Increase Punch damage by @{bonus} and change its type to yours (exit other stances), regain 1 durability each room",
	"Inflict @{mod1Stacks} @{mod1} on all enemies",
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const frailedTargets = [];
		if (isCrit) {
			const foeTeam = (user.team === "delver" ? adventure.room.enemies : adventure.delvers).filter(foe => foe.hp > 0);
			frailedTargets.concat(getNames(addModifier(foeTeam, frail), adventure));
		}
		const { didAddStance, stancesRemoved } = enterStance(user, ironFistStance);
		const resultSentences = [];
		if (stancesRemoved.length > 0) {
			resultSentences.push(`${getNames([user], adventure)} exits ${listifyEN(stancesRemoved, false)}.`);
		}

		if (frailedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, frailedTargets, "becomes", "become", "Frail."));
		}

		if (resultSentences.length > 0) {
			return resultSentences.join(" ");
		} else if (didAddStance) {
			return "";
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setDurability(10);
