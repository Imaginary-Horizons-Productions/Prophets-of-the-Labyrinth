const { EnemyTemplate } = require("../classes");
const { selectSelf, selectAllFoes } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, getNames } = require("../util/combatantUtil");
const { elementsList } = require("../util/elementUtil");
const { joinAsStatement } = require("../util/textUtil.js");

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
		let addedAbsorb = false;
		if (isCrit) {
			addedAbsorb = addModifier([user], { name: `${user.element} Absorb`, stacks: 5 }).length > 0;
			changeStagger([user], "elementMatchAlly");
		} else {
			addedAbsorb = addModifier([user], { name: `${user.element} Absorb`, stacks: 3 }).length > 0;
		}
		if (addedAbsorb) {
			return "Its elemental alignment has changed.";
		} else {
			return "But nothing happened.";
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
		const slowedTargets = addModifier(targets, { name: "Slow", stacks: isCrit ? 3 : 2 });
		if (isCrit) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (slowedTargets.length > 0) {
			return joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed by the sticky ooze.");
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random"
})
	.setFlavorText({ name: "Royal Slime's Element", value: "The Royal Slime will start as the adventure's element and change it with Element Shift." });
