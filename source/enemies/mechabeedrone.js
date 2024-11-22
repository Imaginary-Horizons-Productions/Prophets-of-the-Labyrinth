const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { getEmoji } = require("../util/elementUtil.js");

module.exports = new EnemyTemplate("Mechabee Drone",
	"Darkness",
	125,
	100,
	"5",
	0,
	"Sting",
	false
).addAction({
	name: "Sting",
	element: "Darkness",
	description: `Inflict minor ${getEmoji("Darkness")} damage and @e{Poison} on a single foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 10;
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure).concat(generateModifierResultLines(addModifier(targets, { name: "Poison", stacks: user.crit ? 4 : 2 })));
	},
	selector: selectRandomFoe,
	next: "Barrel Roll"
}).addAction({
	name: "Barrel Roll",
	element: "Untyped",
	description: "Gain @e{Evade}, gain @e{Agility} on Critical Hit",
	priority: 0,
	effect: (targets, user, adventure) => {
		const receipts = addModifier([user], { name: "Evade", stacks: 2 });
		if (user.crit) {
			receipts.push(...addModifier([user], { name: "Agility", stacks: 1 }));
		}
		changeStagger([user], "elementMatchAlly");
		return generateModifierResultLines(combineModifierReceipts(receipts));
	},
	selector: selectSelf,
	next: "Call for Help"
}).addAction({
	name: "Call for Help",
	element: "Untyped",
	description: "Summon another Mechabee",
	priority: 0,
	effect: (targets, user, adventure) => {
		spawnEnemy(module.exports, adventure, true);
		return ["Another mechabee arrives."];
	},
	selector: selectNone,
	next: "Self-Destruct"
}).addAction({
	name: "Self-Destruct",
	element: "Darkness",
	description: `Sacrifice self to deal large ${getEmoji("Darkness")} damage to all foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 125;
		if (user.crit) {
			damage *= 2;
		}
		user.hp = 0;
		changeStagger(targets, "elementMatchFoe");

		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	next: "Sting"
});
