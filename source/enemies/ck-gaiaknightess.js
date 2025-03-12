const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, removeModifier, changeStagger, generateModifierResultLines, addProtection } = require("../util/combatantUtil.js");
const { getModifierCategory } = require("../modifiers/_modifierDictionary.js");
const { selectRandomFoe, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

const asteroid = require("./asteroid.js");
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");

module.exports = new EnemyTemplate("Gaia Knightess",
	"Earth",
	300,
	100,
	"6",
	0,
	"Tremor Smash",
	false
).addAction({
	name: "Damping Wallop",
	essence: "Earth",
	description: `Deal ${getEmoji("Earth")} damage and remove a random buff from a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		const damage = user.getPower() + 75;
		const { resultLines: damageResults, survivors } = dealDamage(targets, user, damage, false, user.essence, adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		for (const target of survivors) {
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			if (targetBuffs.length > 0) {
				const rolledBuff = targetBuffs[user.roundRns[`Damping Wallop${SAFE_DELIMITER}buffs`][0] % targetBuffs.length];
				resultLines.push(...generateModifierResultLines(removeModifier([target], { name: rolledBuff, stacks: "all" })));
			}
		}
		return damageResults.concat(resultLines);
	},
	selector: selectRandomFoe,
	next: "random",
	rnConfig: { "buffs": 1 }
}).addAction({
	name: "Tremor Smash",
	essence: "Earth",
	description: `Deal minor ${getEmoji("Earth")} damage to and Stagger all foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		const damage = user.getPower() + 25;
		const { resultLines: damageResults, survivors } = dealDamage(targets, user, damage, false, user.essence, adventure);
		if (survivors.length > 0) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE + 1);
			resultLines.push(joinAsStatement(false, survivors.map(target => target.name), "is", "are", "Staggered."));
		}
		return damageResults.concat(resultLines);
	},
	selector: selectAllFoes,
	next: "random"
}).addAction({
	name: "Call Asteroid",
	essence: "Unaligned",
	description: "Summon an Asteroid",
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = ["An Asteroid arrives on the battlefield."];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		spawnEnemy(asteroid, adventure);
		return resultLines;
	},
	selector: selectNone,
	next: "Tremor Smash"
});
