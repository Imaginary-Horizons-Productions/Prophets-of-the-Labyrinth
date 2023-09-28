const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, nextRandom } = require("../shared/actionComponents.js");
const { addModifier, dealDamage } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("@{adventure} Slime",
	"@{adventure}",
	200,
	90,
	5,
	0,
	"Tackle",
	false
).addAction({
	name: "Tackle",
	element: "@{adventure}",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 25;
		if (isCrit) {
			damage *= 2;
		}
		addModifier(target, { name: "Stagger", stacks: 1 });
		return dealDamage([target], user, damage, false, adventure.element, adventure);
	},
	selector: selectRandomFoe,
	next: nextRandom
}).addAction({
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
});
