const { EnemyTemplate } = require("../classes");
const { addBlock, addModifier, removeModifier, dealDamage } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf, nextRandom } = require("../shared/actionComponents.js");

module.exports = new EnemyTemplate("Geode Tortoise",
	"Earth",
	350,
	85,
	"3+n*0.5",
	0,
	"random",
	false
).addAction({
	name: "Bite",
	element: "Earth",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 50;
		if (isCrit) {
			damage *= 2;
		}
		addModifier(target, { name: "Stagger", stacks: 1 });
		return dealDamage([target], user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: nextRandom
}).addAction({
	name: "Crystallize",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		addBlock(user, 150);
		if (isCrit) {
			addModifier(user, { name: "Power Up", stacks: 50 });
			removeModifier(user, { name: "Stagger", stacks: 1 });
		} else {
			addModifier(user, { name: "Power Up", stacks: 25 });
		}
		return "It prepares to Block and is Powered Up.";
	},
	selector: selectSelf,
	next: nextRandom
});
