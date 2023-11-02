const { EnemyTemplate } = require("../classes");
const { nextRandom, selectSelf, selectAllFoes } = require("../shared/actionComponents.js");
const { addModifier, dealDamage } = require("../util/combatantUtil");
const { elementsList } = require("../util/elementUtil");

module.exports = new EnemyTemplate("Royal Slime",
	"@{adventure}",
	600,
	90,
	"n*2+4",
	0,
	"Element Shift",
	true
).addAction({
	name: "Element Shift",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const elementPool = elementsList(["Untyped", user.element]);
		user.element = elementPool[adventure.generateRandomNumber(elementPool.length, "battle")];
		if (isCrit) {
			addModifier(user, { name: `${user.element} Absorb`, stacks: 5 });
			user.addStagger("elementMatchAlly");
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
			target.addStagger("elementMatchFoe");
		})
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	next: nextRandom
}).addAction({
	name: "Opposite Rolling Tackle",
	element: "@{adventureOpposite}",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = 75;
		if (isCrit) {
			damage *= 2;
		}
		targets.map(target => {
			target.addStagger("elementMatchFoe");
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
				target.addStagger("elementMatchFoe");
			} else {
				addModifier(target, { name: "Slow", stacks: 2 });
			}
		});
		return "Everyone is Slowed by the sticky ooze.";
	},
	selector: selectAllFoes,
	next: nextRandom
});
