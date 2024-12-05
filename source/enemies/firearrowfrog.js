const { EnemyTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_ALLY, ELEMENT_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");

module.exports = new EnemyTemplate("Fire-Arrow Frog",
	"Fire",
	250,
	100,
	"4",
	0,
	"random",
	false
).addAction({
	name: "Venom Cannon",
	element: "Fire",
	description: `Inflict minor ${getEmoji("Fire")} damage and @e{Poison} on a single foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 20;
		const resultLines = dealDamage(targets, user, damage, false, user.element, adventure);
		return resultLines.concat(generateModifierResultLines(addModifier(targets, { name: "Poison", stacks: user.crit ? 6 : 3 })));
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Burrow",
	element: "Untyped",
	description: "Gain Evade",
	priority: 0,
	effect: (targets, user, adventure) => {
		let stacks = 2;
		if (user.crit) {
			stacks *= 3;
		}
		changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		return generateModifierResultLines(addModifier([user], { name: "Evade", stacks }));
	},
	selector: selectSelf,
	next: "Venom Cannon"
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Slow a single foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Slow", stacks: user.crit ? 3 : 2 })));
	},
	selector: selectRandomFoe,
	next: "Venom Cannon"
});
