const { EnemyTemplate } = require("../classes");
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require("../constants");
const { selectSelf, selectAllFoes } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { essenceList } = require("../util/essenceUtil");

module.exports = new EnemyTemplate("Royal Slime",
	"@{adventure}",
	600,
	90,
	"n*2+4",
	0,
	"Essence Shift",
	true
).addAction({
	name: "Essence Shift",
	essence: "Unaligned",
	description: "Change the Royal Slime's essence to one that doesn't counter it and gain Absorption for that essence",
	priority: 0,
	effect: (targets, user, adventure) => {
		const essencePool = essenceList(["Unaligned", user.essence]);
		user.essence = essencePool[user.roundRns[`Essence Shift${SAFE_DELIMITER}essenceShift`][0] % essencePool.length];
		let addedAbsorption = false;
		if (user.crit) {
			addedAbsorption = addModifier([user], { name: `${user.essence} Absorption`, stacks: 5 }).some(receipt => receipt.succeeded.size > 0);
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		} else {
			addedAbsorption = addModifier([user], { name: `${user.essence} Absorption`, stacks: 3 }).some(receipt => receipt.succeeded.size > 0);
		}
		if (addedAbsorption) {
			return [`${user.name}'s essence has changed.`];
		} else {
			return [];
		}
	},
	selector: selectSelf,
	next: "random",
	rnConfig: { "essenceShift": 1 }
}).addAction({
	name: "Rolling Tackle",
	essence: "@{adventure}",
	description: "Deal damage of the Royal Slime's essence to all foes",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure);
	},
	selector: selectAllFoes,
	next: "random"
}).addAction({
	name: "Opposite Rolling Tackle",
	essence: "@{adventureOpposite}",
	description: "Deal damage of the opposite essence of the Royal Slime to all foes",
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure);
	},
	selector: selectAllFoes,
	next: "random"
}).addAction({
	name: "Goop Deluge",
	essence: "Unaligned",
	description: "Inflict @e{Slow} on all foes",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Slow", stacks: user.crit ? 3 : 2 })));
	},
	selector: selectAllFoes,
	next: "random"
})
	.setFlavorText({ name: "The Royal Slime's Essence", value: "The Royal Slime starts as the adventure's essence and change it with Essence Shift." });
