const { EnemyTemplate, Combatant, Adventure } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { selectRandomFoe, selectAllFoes } = require("../shared/actionComponents");
const { dealDamage, addModifier, changeStagger, addProtection, getNames } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");
const { listifyEN, joinAsStatement } = require("../util/textUtil");

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
	element: "Light",
	description: `Deal ${getEmoji("Light")} damage to a single foe; increases with foe's debuffs, cursed gear, and unfinished challenges`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		const unfinishedChallenges = [];
		for (const [challengeName, { duration }] of Object.entries(adventure.challenges)) {
			// Indefinite challenge duration defined as "unfinished"
			if (duration !== 0) {
				unfinishedChallenges.push(challengeName);
			}
		}
		const targetDebuffCount = Object.keys(target.modifiers).reduce((count, modifier) => {
			if (isDebuff(modifier)) {
				return count + 1;
			} else {
				return count;
			}
		}, 0);
		let targetCursedGearCount = 0;
		if ("gear" in target) {
			for (const gearPiece of target.gear) {
				if (gearPiece.name.startsWith("Cursed")) {
					targetCursedGearCount++;
				}
			}
		}
		let pendingDamage = user.getPower() + 100 + (50 * (unfinishedChallenges.length + targetDebuffCount + targetCursedGearCount));
		changeStagger([target], "elementMatchFoe");
		if (isCrit) {
			pendingDamage *= 2;
		}
		if (unfinishedChallenges.length > 0) {
			return `"Ha! You didn't finish **${unfinishedChallenges[adventure.generateRandomNumber(unfinishedChallenges.length, "battle")]}**. ${dealDamage([target], user, pendingDamage, false, "Light", adventure)}"`;
		} else {
			return dealDamage([target], user, pendingDamage, false, "Light", adventure);
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: "random"
}).addAction({
	name: "Center of Attention",
	element: "Light",
	description: `Inflict ${getEmoji("Light")} damage and apply insults on all foes (damage increases with foe team size)`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let pendingDamage = user.getPower() + 50 * targets.length;
		const insultMap = {};
		changeStagger(targets, "elementMatchFoe");
		addNewRandomInsults(insultMap, targets, isCrit ? 2 : 1, adventure);
		const insultEntries = Object.entries(insultMap);
		if (insultEntries.length > 0) {
			return `"Fear not! I have enough Star Power to take you all on!" ${dealDamage(targets, user, pendingDamage, false, "Light", adventure)} ${Object.entries(insultMap).map(([combatantName, insultList]) => `${combatantName} gains ${listifyEN(insultList, false)}.`).join(" ")}`;
		} else {
			return `"Fear not! I have enough Star Power to take you all on!" ${dealDamage(targets, user, pendingDamage, false, "Light", adventure)}`;
		}
	},
	selector: selectAllFoes,
	needsLivingTargets: true,
	next: "random"
}).addAction({
	name: "\"Share\" the Spotlight",
	element: "Untyped",
	description: `Inflict @e{Exposed} and random insults on all foes, gain protection on a crit`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		changeStagger(targets, "elementMatchFoe");
		if (isCrit) {
			addProtection([user], 100);
		}
		const frailedTargets = addModifier(targets, { name: "Exposed", stacks: 1 });
		const resultSentences = [joinAsStatement(false, getNames(frailedTargets, adventure), "is", "are", "Exposed.")];
		const insultMap = {};
		addNewRandomInsults(insultMap, targets, 1, adventure);
		resultSentences.push(Object.entries(insultMap).map(([combatantName, insultList]) => `${combatantName} gains ${listifyEN(insultList, false)}.`).join(" "));
		return resultSentences.join(" ");
	},
	selector: selectAllFoes,
	needsLivingTargets: true,
	next: "random"
}).addAction({
	name: "Boast",
	element: "Light",
	description: `Inflict @e{Distracted} and ${getEmoji("Light")} damage on a single foe`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		changeStagger(targets, "elementMatchFoe");
		let pendingDamage = user.getPower() + 100;
		if (isCrit) {
			pendingDamage *= 2;
		}
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, "Light", adventure)];
		const distractedTargets = addModifier(targets, { name: "Distracted", stacks: 4 });
		if (distractedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(distractedTargets, adventure), "is", "are", "Distracted."));
		}
		return resultSentences.join(" ");
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: "random"
}).setFlavorText({ name: "Insult to Injury", value: "Insult debuffs (@e{Ugly}, @e{Stupid}, @e{Smelly}, @e{Boring}, @e{Lacking Rhythm}) make the Starry Knight's Mock the Accursed more dangerous. Appease the Starry Knight to cure them all." });

/** avoid grouping addModifier by insult, since delvers want to know how many insults they've gained, thus we want to group by delver
 * @param {Record<string, string[]>} insultMap
 * @param {Combatant[]} combatants
 * @param {number} count
 * @param {Adventure} adventure
 */
function addNewRandomInsults(insultMap, combatants, count, adventure) {
	const combatantNames = getNames(combatants, adventure);
	combatants.forEach((combatant, index) => {
		const availableInsults = ["Ugly", "Stupid", "Smelly", "Boring", "Lacking Rhythm"].filter(insult => !(insult in combatant.modifiers));
		for (let i = 0; i < count; i++) {
			if (availableInsults.length < 1) {
				break;
			}
			const insultIndex = adventure.generateRandomNumber(availableInsults.length, "battle");
			const rolledInsult = availableInsults[insultIndex];
			const combatantName = combatantNames[index];
			const didAddInsult = addModifier([combatant], { name: rolledInsult, stacks: 1 }).length > 0;
			if (didAddInsult) {
				if (combatantName in insultMap) {
					insultMap[combatantName].push(rolledInsult);
				} else {
					insultMap[combatantName] = [rolledInsult];
				}
				availableInsults.splice(insultIndex, 1);
			}
		}
	})
}
