const { EnemyTemplate } = require("../classes");
const { addBlock, addModifier, dealDamage } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf, nextRandom } = require("../shared/actionComponents.js");

module.exports = new EnemyTemplate("Geode Tortoise",
	"Earth",
	350,
	85,
	"6+n",
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
		target.addStagger("elementMatchFoe");
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
			user.addStagger("elementMatchAlly");
		} else {
			addModifier(user, { name: "Power Up", stacks: 25 });
		}
		return "It prepares to Block and is Powered Up.";
	},
	selector: selectSelf,
	next: nextRandom
});
