const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, nextRandom } = require("../util/actionComponents.js");
const { addModifier, dealDamage } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("@{adventureOpposite} Ooze",
	"@{adventureOpposite}",
	200,
	90,
	5,
	0,
	"Goop Spray",
	false
).addAction({
	name: "Goop Spray",
	element: "Untyped",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		if (isCrit) {
			addModifier(target, { name: "Slow", stacks: 3 });
			addModifier(target, { name: "Stagger", stacks: 1 });
		} else {
			addModifier(target, { name: "Slow", stacks: 2 });
		}
		return `${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
	},
	selector: selectRandomFoe,
	next: nextRandom
}).addAction({
	name: "Tackle",
	element: "@{adventureOpposite}",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 25;
		if (isCrit) {
			damage *= 2;
		}
		addModifier(target, { name: "Stagger", stacks: 1 });
		return dealDamage([target], user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: nextRandom
});
