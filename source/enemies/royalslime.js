const { EnemyTemplate } = require("../classes");
const { nextRandom, selectSelf, selectAllFoes, selectRandomFoe } = require("../util/actionComponents.js");
const { elementsList } = require("../util/elementUtil");
// const { generateRandomNumber } = require("../../helpers.js");
// const { addModifier, dealDamage, removeModifier } = require("../combatantDAO.js");

module.exports = new EnemyTemplate("Royal Slime",
	"@{adventure}",
	600,
	90,
	5,
	0,
	"Element Shift",
	true
).addAction({
	name: "Element Shift",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const elementPool = elementsList([user.element]);
		user.element = elementPool[generateRandomNumber(adventure, elementPool.length, "battle")];
		if (isCrit) {
			addModifier(user, { name: `${user.element} Absorb`, stacks: 5 });
			removeModifier(user, { name: "Stagger", stacks: 1 });
		} else {
			addModifier(user, { name: `${user.element} Absorb`, stacks: 3 });
		}
		return "Its elemental alignment has changed.";
	},
	selector: selectSelf,
	next: nextRandom
}).addAction({
	name: "Rolling Tackle",
	element: "@{adventure}",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = 75;
		if (isCrit) {
			damage *= 2;
		}
		targets.map(target => {
			addModifier(target, { name: "Stagger", stacks: 1 });
		})
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	next: nextRandom
}).addAction({
	name: "Goop Deluge",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		targets.forEach(target => {
			if (isCrit) {
				addModifier(target, { name: "Slow", stacks: 3 });
				addModifier(target, { name: "Stagger", stacks: 1 });
			} else {
				addModifier(target, { name: "Slow", stacks: 2 });
			}
		});
		return "Everyone is Slowed by the sticky ooze.";
	},
	selector: selectAllFoes,
	next: nextRandom
}).addAction({
	name: "Toxic Spike Shot",
	element: "@{adventure}",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 25;
		if (isCrit) {
			damage *= 2;
		}
		addModifier(target, { name: "Stagger", stacks: 1 });
		addModifier(target, { name: "Poison", stacks: 2 });
		return dealDamage([target], user, damage, false, user.element, adventure).then(damageText => {
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
		});
	},
	selector: selectRandomFoe,
	next: nextRandom
});
