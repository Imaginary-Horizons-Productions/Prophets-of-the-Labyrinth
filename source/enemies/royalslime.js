const { EnemyTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { selectSelf, selectAllFoes } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
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
	effect: (targets, user, adventure) => {
		const elementPool = elementsList(["Untyped", user.element]);
		user.element = elementPool[user.roundRns[`Element Shift${SAFE_DELIMITER}elements`][0] % elementPool.length];
		let addedAbsorb = false;
		if (user.crit) {
			addedAbsorb = addModifier([user], { name: `${user.element} Absorb`, stacks: 5 }).some(receipt => receipt.succeeded.size > 0);
			changeStagger([user], "elementMatchAlly");
		} else {
			addedAbsorb = addModifier([user], { name: `${user.element} Absorb`, stacks: 3 }).some(receipt => receipt.succeeded.size > 0);
		}
		if (addedAbsorb) {
			return [`${user.name}'s elemental alignment has changed.`];
		} else {
			return [];
		}
	},
	selector: selectSelf,
	next: "random",
	rnConfig: { "elements": 1 }
}).addAction({
	name: "Rolling Tackle",
	element: "@{adventure}",
	description: "Deal damage of the Royal Slime's element to all foes",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	next: "random"
}).addAction({
	name: "Opposite Rolling Tackle",
	element: "@{adventureOpposite}",
	description: "Deal damage of the opposite element of the Royal Slime to all foes",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	next: "random"
}).addAction({
	name: "Goop Deluge",
	element: "Untyped",
	description: "Inflict @e{Slow} on all foes",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, "elementMatchFoe");
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Slow", stacks: user.crit ? 3 : 2 })));
	},
	selector: selectAllFoes,
	next: "random"
})
	.setFlavorText({ name: "Royal Slime's Element", value: "The Royal Slime will start as the adventure's element and change it with Element Shift." });
