const { bold } = require("discord.js");
const { EnemyTemplate, Combatant, Adventure } = require("../classes");
const { getModifierCategory } = require("../modifiers/_modifierDictionary");
const { selectRandomFoe, selectAllFoes } = require("../shared/actionComponents");
const { dealDamage, addModifier, changeStagger, addProtection } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants");

module.exports = new EnemyTemplate("Starry Knight",
	"Light",
	2000,
	100,
	"n*5",
	0,
	"random",
	true
).addAction({
	name: "Mock the Accursed",
	essence: "Light",
	description: `Deal ${getEmoji("Light")} damage to a foe; increases with foe's debuffs, cursed gear, and unfinished challenges`,
	priority: 0,
	effect: ([target], user, adventure) => {
		const unfinishedChallenges = [];
		for (const [challengeName, { duration }] of Object.entries(adventure.challenges)) {
			// Indefinite challenge duration defined as "unfinished"
			if (duration !== 0) {
				unfinishedChallenges.push(challengeName);
			}
		}
		const targetDebuffCount = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff").length;
		let targetCursedGearCount = 0;
		if ("gear" in target) {
			for (const gearPiece of target.gear) {
				if (gearPiece.name.startsWith("Cursed")) {
					targetCursedGearCount++;
				}
			}
		}
		let pendingDamage = user.getPower() + 100 + (50 * (unfinishedChallenges.length + targetDebuffCount + targetCursedGearCount));
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		if (user.crit) {
			pendingDamage *= 2;
		}
		if (unfinishedChallenges.length > 0) {
			return [`"Ha! You didn't finish ${bold(unfinishedChallenges[adventure.generateRandomNumber(unfinishedChallenges.length, "battle")])}."`, ...dealDamage([target], user, pendingDamage, false, "Light", adventure).results];
		} else {
			return dealDamage([target], user, pendingDamage, false, "Light", adventure).results;
		}
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Center of Attention",
	essence: "Light",
	description: `Inflict ${getEmoji("Light")} damage and apply insults on all foes (damage increases with foe team size)`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let pendingDamage = user.getPower() + 50 * targets.length;
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, pendingDamage, false, "Light", adventure).results
			.concat(addNewRandomInsults(targets, user.crit ? 2 : 1, adventure));
	},
	selector: selectAllFoes,
	next: "random",
	combatFlavor: "\"Fear not! I have enough Star Power to take you all on!\""
}).addAction({
	name: "\"Share\" the Spotlight",
	essence: "Unaligned",
	description: `Inflict @e{Exposure} and random insults on all foes, gain protection on Critical`,
	priority: 0,
	effect: (targets, user, adventure) => {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		if (user.crit) {
			addProtection([user], 100);
		}
		return addModifier(targets, { name: "Exposure", stacks: 1 }).concat(addNewRandomInsults(targets, 1, adventure));
	},
	selector: selectAllFoes,
	next: "random"
}).addAction({
	name: "Boast",
	essence: "Light",
	description: `Inflict @e{Distraction} and ${getEmoji("Light")} damage on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		let pendingDamage = user.getPower() + 100;
		if (user.crit) {
			pendingDamage *= 2;
		}
		return dealDamage(targets, user, pendingDamage, false, "Light", adventure).results.concat(addModifier(targets, { name: "Distraction", stacks: 4 }));
	},
	selector: selectRandomFoe,
	next: "random"
}).setFlavorText({ name: "Insult to Injury", value: "Insult debuffs (@e{Ugly}, @e{Stupid}, @e{Smelly}, @e{Boring}, @e{Lacking Rhythm}) make the Starry Knight's Mock the Accursed more dangerous. Appease the Starry Knight to cure them all." });

/** avoid grouping addModifier by insult, since delvers want to know how many insults they've gained, thus we want to group by delver
 * @param {Record<string, string[]>} insultMap
 * @param {Combatant[]} combatants
 * @param {number} count
 * @param {Adventure} adventure
 */
function addNewRandomInsults(combatants, count, adventure) {
	const receipts = [];
	for (const combatant of combatants) {
		const availableInsults = ["Ugly", "Stupid", "Smelly", "Boring", "Lacking Rhythm"].filter(insult => !(insult in combatant.modifiers));
		for (let i = 0; i < count; i++) {
			if (availableInsults.length < 1) {
				break;
			}
			const insultIndex = adventure.generateRandomNumber(availableInsults.length, "battle");
			const rolledInsult = availableInsults[insultIndex];
			const [receipt] = addModifier([combatant], { name: rolledInsult, stacks: 1 });
			receipts.push(receipt);
			if (receipt.addedModifiers.size > 0) {
				availableInsults.splice(insultIndex, 1);
			}
		}
	}
	return receipts;
}
