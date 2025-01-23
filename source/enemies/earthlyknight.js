const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, removeModifier, changeStagger, generateModifierResultLines } = require("../util/combatantUtil.js");
const { getModifierCategory } = require("../modifiers/_modifierDictionary");
const { selectRandomFoe, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

const asteroid = require("./asteroid.js");
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");

module.exports = new EnemyTemplate("Earthly Knight",
	"Earth",
	275,
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
		let damage = user.getPower() + 75;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		const resultLines = dealDamage(targets, user, damage, false, user.essence, adventure).resultLines;
		for (const target of targets) {
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			if (targetBuffs.length > 0) {
				const rolledBuff = targetBuffs[user.roundRns[`Damping Wallop${SAFE_DELIMITER}buffs`][0] % targetBuffs.length];
				resultLines.push(...generateModifierResultLines(removeModifier([target], { name: rolledBuff, stacks: "all" })));
			}
		}
		return resultLines;
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
		let damage = user.getPower() + 5;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, 2);
		return [...dealDamage(targets, user, damage, false, user.essence, adventure).resultLines, joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered.")];
	},
	selector: selectAllFoes,
	next: "random"
}).addAction({
	name: "Call Asteroid",
	essence: "Unaligned",
	description: "Summon an Asteroid",
	priority: 0,
	effect: (targets, user, adventure) => {
		spawnEnemy(asteroid, adventure);
		return ["An Asteroid arrives on the battlefield."];
	},
	selector: selectNone,
	next: "Tremor Smash"
});
