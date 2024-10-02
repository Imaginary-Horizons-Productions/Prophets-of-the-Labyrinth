const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, removeModifier, changeStagger, generateModifierResultLines } = require("../util/combatantUtil.js");
const { isBuff } = require("../modifiers/_modifierDictionary");
const { selectRandomFoe, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

const asteroid = require("./asteroid.js");

module.exports = new EnemyTemplate("Earthly Knight",
	"Earth",
	250,
	100,
	"6",
	0,
	"Tremor Smash",
	false
).addAction({
	name: "Damping Wallop",
	element: "Earth",
	description: `Inflict ${getEmoji("Earth")} damage and remove a random buff`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 75;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		const resultLines = dealDamage(targets, user, damage, false, user.element, adventure);
		for (const target of targets) {
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => isBuff(modifier));
			if (targetBuffs.length > 0) {
				const buffIndex = adventure.generateRandomNumber(targetBuffs.length, "battle");
				const rolledBuff = targetBuffs[buffIndex];
				resultLines.push(...generateModifierResultLines(removeModifier([target], { name: rolledBuff, stacks: "all" })));
			}
		}
		return resultLines;
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: "random"
}).addAction({
	name: "Tremor Smash",
	element: "Earth",
	description: `Deal minor ${getEmoji("Earth")} to all foes and stagger them`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 5;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, 2);
		return [...dealDamage(targets, user, damage, false, user.element, adventure), joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered.")];
	},
	selector: selectAllFoes,
	needsLivingTargets: true,
	next: "random"
}).addAction({
	name: "Call Asteroid",
	element: "Untyped",
	description: "Summon an Asteroid",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		spawnEnemy(asteroid, adventure);
		return ["An Asteroid arrives on the battlefield."];
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: "Tremor Smash"
});
