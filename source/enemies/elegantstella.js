const { EnemyTemplate, Adventure } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants");
const { selectAllFoes, selectRandomFoe } = require("../shared/actionComponents");
const { changeStagger, generateModifierResultLines, addModifier, dealDamage } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

const nonOpenerMoves = ["Tonitrus Spark", "Big Bang"];
/**
 * @param {string} currentMove
 * @param {Adventure} adventure
 */
function randomNonOpener(currentMove, adventure) {
	return nonOpenerMoves[adventure.generateRandomNumber(nonOpenerMoves.length, "battle")];
}

module.exports = new EnemyTemplate("Elegant Stella",
	"Light",
	180,
	75,
	"2",
	0,
	"Celestial Countdown",
	false
).addAction({
	name: "Celestial Countdown",
	essence: "Unaligned",
	description: "Inflict great @e{Misfortune} on all foes",
	priority: 0,
	effect: (targets, user, adventure) => {
		const pendingMisfortune = { name: "Misfortune", stacks: 11 };
		if (user.crit) {
			pendingMisfortune.stacks += 7;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return generateModifierResultLines(addModifier(targets, pendingMisfortune));
	},
	selector: selectAllFoes,
	next: randomNonOpener
}).addAction({
	name: "Tonitrus Spark",
	essence: "Unaligned",
	description: "Inflict accelerating @e{Misfortune} on a foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		const pendingMisfortune = { name: "Misfortune", stacks: 6 };
		if (user.crit) {
			pendingMisfortune.stacks += 6;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return generateModifierResultLines(addModifier(targets, pendingMisfortune));
	},
	selector: selectRandomFoe,
	next: randomNonOpener
}).addAction({
	name: "Big Bang",
	essence: "Light",
	description: `Deal minor ${getEmoji("Light")} damage and slowing @e{Misfortune} to all foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let pendingMisfortune = 1;
		if (user.crit) {
			pendingMisfortune += 7;
		}
		const { resultLines, survivors } = dealDamage(targets, user, user.getPower() + 25, false, "Light", adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(addModifier(survivors, { name: "Misfortune", stacks: pendingMisfortune })));
	},
	selector: selectAllFoes,
	next: randomNonOpener
});
