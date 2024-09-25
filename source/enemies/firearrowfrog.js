const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, getNames } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

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
	effect: (targets, user, isCrit, adventure) => {
		const poisonedTargets = addModifier(targets, { name: "Poison", stacks: isCrit ? 6 : 3 });
		let damage = user.getPower() + 20;
		return [...dealDamage(targets, user, damage, false, user.element, adventure), joinAsStatement(true, getNames(poisonedTargets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Poison")}.`)];
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Burrow",
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
			return [`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Evade")}.`];
		} else {
			return [];
		}
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "Venom Cannon"
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Slow a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const slowedTargets = addModifier(targets, { name: "Slow", stacks: isCrit ? 3 : 2 });
		if (isCrit) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (slowedTargets.length > 0) {
			return [joinAsStatement(false, getNames(slowedTargets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Slow")}.`)];
		} else {
			return [];
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "Venom Cannon"
});
