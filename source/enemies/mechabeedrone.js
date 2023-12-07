const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { getEmoji } = require("../util/elementUtil.js");

const PATTERN = {
	"Sting": "Barrel Roll",
	"Barrel Roll": "Call for Help",
	"Call for Help": "Self-Destruct",
	"Self-Destruct": "Sting"
}
function dronePattern(actionName) {
	return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Mechabee Drone",
	"Darkness",
	200,
	100,
	"6",
	0,
	"Sting",
	false
).addAction({
	name: "Sting",
	element: "Darkness",
	description: `Inflict minor ${getEmoji("Darkness")} damage and Poison on a single foe`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		target.addStagger("elementMatchFoe");
		let addedPoison = false;
		if (isCrit) {
			addedPoison = addModifier(target, { name: "Poison", stacks: 4 });
		} else {
			addedPoison = addModifier(target, { name: "Poison", stacks: 2 });
		}
		return `${dealDamage([target], user, 10, false, user.element, adventure)}${addedPoison ? ` ${target.getName(adventure.room.enemyIdMap)} is Poisoned.` : ""}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: dronePattern
}).addAction({
	name: "Barrel Roll",
	element: "Untyped",
	description: "Gain Evade",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let stacks = 2;
		if (isCrit) {
			stacks *= 3;
		}
		const addedEvade = addModifier(user, { name: "Evade", stacks });
		user.addStagger("elementMatchAlly");
		if (addedEvade) {
			return "It's prepared to Evade.";
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: dronePattern
}).addAction({
	name: "Call for Help",
	element: "Untyped",
	description: "Summon another Mechabee",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		spawnEnemy(module.exports, adventure);
		return "Another mechabee arrives.";
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: dronePattern
}).addAction({
	name: "Self-Destruct",
	element: "Darkness",
	description: `Sacrifice self to deal large ${getEmoji("Darkness")} damage to all foes`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = 125;
		if (isCrit) {
			damage *= 2;
		}
		user.hp = 0;
		targets.map(target => {
			target.addStagger("elementMatchFoe");
		})

		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: dronePattern
});
