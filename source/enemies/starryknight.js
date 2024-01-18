const { EnemyTemplate, Combatant, Adventure } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { nextRandom, selectRandomFoe, selectAllFoes } = require("../shared/actionComponents");
const { dealDamage, addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");
const { listifyEN } = require("../util/textUtil");

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
	description: `Inflict ${getEmoji("Light")} damage to a single foe; increases with foe's debuffs and unfinished challenges`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		const unfinishedChallenges = [];
		for (const [challengeName, { duration }] of Object.entries(adventure.challenges)) {
			// Indefinite challenges defined as "unfinished"
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
		let pendingDamage = 100 + (50 * (unfinishedChallenges.length + targetDebuffCount));
		target.addStagger("elementMatchFoe");
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
	next: nextRandom
}).addAction({
	name: "Center of Attention",
	element: "Light",
	description: `Inflict ${getEmoji("Light")} damage and apply insults on all foes (damage increases with foe team size)`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let pendingDamage = 50 * targets.length;
		const insultMap = {};
		targets.forEach(target => {
			target.addStagger("elementMatchFoe");
			if (isCrit) {
				addNewRandomInsults(insultMap, target, 2, adventure);
			} else {
				addNewRandomInsults(insultMap, target, 1, adventure);
			}
		})
		const insultEntries = Object.entries(insultMap);
		if (insultEntries.length > 0) {
			return `"Fear not! I have enough Star Power to take you all on!" ${dealDamage(targets, user, pendingDamage, false, "Light", adventure)} ${Object.entries(insultMap).map(([combatantName, insultList]) => `${combatantName} gains ${listifyEN(insultList)}.`).join(" ")}`;
		} else {
			return `"Fear not! I have enough Star Power to take you all on!" ${dealDamage(targets, user, pendingDamage, false, "Light", adventure)}`;
		}
	},
	selector: selectAllFoes,
	needsLivingTargets: true,
	next: nextRandom
}).addAction({
	name: "Boast",
	element: "Untyped",
	description: "Inflict Frail and random insults on all foes, gain protection on a crit",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		if (isCrit) {
			user.protection += 100;
		}
		const frailedTargets = [];
		const insultMap = {};
		targets.forEach(target => {
			const addedFrail = addModifier(target, { name: "Frail", stacks: 4 });
			if (addedFrail) {
				frailedTargets.push(target.getName(adventure.room.enemyIdMap));
			}
			addNewRandomInsults(insultMap, target, 1, adventure);
		})
		const insultEntries = Object.entries(insultMap);
		if (frailedTargets.length === 1) {
			if (insultEntries.length > 0) {
				return `${frailedTargets[0]} gains Frail. ${insultEntries.map(([combatantName, insultList]) => `${combatantName} gains ${listifyEN(insultList)}.`).join(" ")}`;
			} else {
				return `${frailedTargets[0]} gains Frail.`;
			}
		} else {
			if (insultEntries.length > 0) {
				return `${listifyEN(frailedTargets)} gain Frail. ${insultEntries.map(([combatantName, insultList]) => `${combatantName} gains ${listifyEN(insultList)}.`).join(" ")}`;
			} else {
				return `${listifyEN(frailedTargets)} gain Frail.`;
			}
		}
	},
	selector: selectAllFoes,
	needsLivingTargets: true,
	next: nextRandom
}).setFlavorText({ name: "Insult to Injury", value: "Insult debuffs (Ugly, Stupid, Smelly, Boring, Lacking Rhythm) make the Starry Knight's Mock the Accursed more dangerous. Appease the Starry Knight to cure them all." });

/**
 * @param {Record<string, string[]>} insultMap
 * @param {Combatant} combatant
 * @param {number} count
 * @param {Adventure} adventure
 */
function addNewRandomInsults(insultMap, combatant, count, adventure) {
	const availableInsults = ["Ugly", "Stupid", "Smelly", "Boring", "Lacking Rhythm"].filter(insult => !(insult in combatant.modifiers));
	for (let i = 0; i < count; i++) {
		const insultIndex = adventure.generateRandomNumber(availableInsults.length, "battle");
		const rolledInsult = availableInsults[insultIndex];
		const combatantName = combatant.getName(adventure.room.enemyIdMap);
		const didAddInsult = addModifier(combatant, { name: rolledInsult, stacks: 1 });
		if (didAddInsult) {
			if (combatantName in insultMap) {
				insultMap[combatantName].push(rolledInsult);
			} else {
				insultMap[combatantName] = [rolledInsult];
			}
			availableInsults.splice(insultIndex, 1);
		}
	}
}
