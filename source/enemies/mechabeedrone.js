const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");

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
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		target.addStagger("elementMatchFoe");
		if (isCrit) {
			addModifier(target, { name: "Poison", stacks: 4 });
		} else {
			addModifier(target, { name: "Poison", stacks: 2 });
		}
		return dealDamage([target], user, 10, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: dronePattern
}).addAction({
	name: "Barrel Roll",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let stacks = 2;
		if (isCrit) {
			stacks *= 3;
		}
		addModifier(user, { name: "Evade", stacks });
		user.addStagger("elementMatchAlly");
		return "It's prepared to Evade.";
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: dronePattern
}).addAction({
	name: "Call for Help",
	element: "Untyped",
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
