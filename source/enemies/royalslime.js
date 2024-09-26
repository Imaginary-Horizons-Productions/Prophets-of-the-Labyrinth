const { EnemyTemplate } = require("../classes");
const { selectSelf, selectAllFoes } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger } = require("../util/combatantUtil");
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
	description: "Change the Royal Slime's element to an element it's currently neutral to and gain Absorb for that element",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const elementPool = elementsList(["Untyped", user.element]);
		user.element = elementPool[adventure.generateRandomNumber(elementPool.length, "battle")];
		const addedAbsorb = user.getModifierStacks("Oblivious") < 1;
		if (isCrit) {
			addModifier([user], { name: `${user.element} Absorb`, stacks: 5 });
			changeStagger([user], "elementMatchAlly");
		} else {
			addModifier([user], { name: `${user.element} Absorb`, stacks: 3 });
		}
		if (addedAbsorb) {
			return [`${user.name}'s elemental alignment has changed.`];
		} else {
			return [];
		}
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Rolling Tackle",
	element: "@{adventure}",
	description: "Deal damage of the Royal Slime's element to all foes",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 75;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Opposite Rolling Tackle",
	element: "@{adventureOpposite}",
	description: "Deal damage of the opposite element of the Royal Slime to all foes",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 75;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Goop Deluge",
	element: "Untyped",
	description: "Inflict @e{Slow} on all foes",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		if (isCrit) {
			changeStagger(targets, "elementMatchFoe");
		}
		return addModifier(targets, { name: "Slow", stacks: isCrit ? 3 : 2 });
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random"
})
	.setFlavorText({ name: "Royal Slime's Element", value: "The Royal Slime will start as the adventure's element and change it with Element Shift." });
