const { EnemyTemplate } = require("../classes");
const { dealDamage, addModifier, removeModifier } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");

const PATTERN = {
	"Sting": "Barrel Roll",
	"Barrel Roll": "Call for Help",
	"Call for Help": "Self-Destruct",
	"Self-Destruct": "Sting"
}
function mechabeePattern(actionName) {
	return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Mechabee",
	"Darkness",
	200,
	100,
	"3",
	0,
	"Sting",
	false
).addAction({
	name: "Sting",
	element: "Darkness",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		addModifier(target, { name: "Stagger", stacks: 1 });
		if (isCrit) {
			addModifier(target, { name: "Poison", stacks: 4 });
		} else {
			addModifier(target, { name: "Poison", stacks: 2 });
		}
		return dealDamage([target], user, 10, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: mechabeePattern
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
		removeModifier(user, { name: "Stagger", stacks: 1 });
		return "It's prepared to Evade.";
	},
	selector: selectSelf,
	next: mechabeePattern
}).addAction({
	name: "Call for Help",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		spawnEnemy(module.exports, adventure);
		return "Another mechabee arrives.";
	},
	selector: selectNone,
	next: mechabeePattern
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
			addModifier(target, { name: "Stagger", stacks: 1 });
		})

		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	next: mechabeePattern
});
