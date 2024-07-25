const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger, getNames } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { getEmoji } = require("../util/elementUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");
const { getModifierEmoji } = require("../modifiers/_modifierDictionary.js");

module.exports = new EnemyTemplate("Mechabee Drone",
	"Darkness",
	200,
	100,
	"6",
	0,
	"Sting",
	false
).addAction({
	name: "Sting",
	element: "Darkness",
	description: `Inflict minor ${getEmoji("Darkness")} damage and ${getModifierEmoji("Poison")} on a single foe`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 10;
		changeStagger(targets, "elementMatchFoe");
		const poisonedTargets = addModifier(targets, { name: "Poison", stacks: isCrit ? 4 : 2 });
		return `${dealDamage(targets, user, damage, false, user.element, adventure)} ${joinAsStatement(false, getNames(poisonedTargets, adventure), "is", "are", "Poisoned.")}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "Barrel Roll"
}).addAction({
	name: "Barrel Roll",
	element: "Untyped",
	description: "Gain Evade",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let stacks = 2;
		if (isCrit) {
			stacks *= 3;
		}
		const addedEvade = addModifier([user], { name: "Evade", stacks }).length > 0;
		changeStagger([user], "elementMatchAlly");
		if (addedEvade) {
			return "It's prepared to Evade.";
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "Call for Help"
}).addAction({
	name: "Call for Help",
	element: "Untyped",
	description: "Summon another Mechabee",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		spawnEnemy(module.exports, adventure);
		return "Another mechabee arrives.";
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: "Self-Destruct"
}).addAction({
	name: "Self-Destruct",
	element: "Darkness",
	description: `Sacrifice self to deal large ${getEmoji("Darkness")} damage to all foes`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 125;
		if (isCrit) {
			damage *= 2;
		}
		user.hp = 0;
		changeStagger(targets, "elementMatchFoe");

		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "Sting"
});
