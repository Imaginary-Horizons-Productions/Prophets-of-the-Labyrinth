const { EnemyTemplate } = require("../classes");
const { addModifier, dealDamage, changeStagger, addProtection } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");

module.exports = new EnemyTemplate("Geode Tortoise",
	"Earth",
	350,
	85,
	"6+n",
	0,
	"random",
	false
).addAction({
	name: "Bite",
	element: "Earth",
	description: `Deals ${getEmoji("Earth")} damage to a single foe`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 50;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Crystallize",
	element: "Untyped",
	description: `Gain protection and @e{Power Up}`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let addedPowerUp = false;
		addProtection([user], 25);
		if (isCrit) {
			addedPowerUp = addModifier([user], { name: "Power Up", stacks: 50 }).length > 0;
			changeStagger([user], "elementMatchAlly");
		} else {
			addedPowerUp = addModifier([user], { name: "Power Up", stacks: 25 }).length > 0;
		}
		return [`It gains protection${addedPowerUp ? ` and ${getApplicationEmojiMarkdown("Power Up")}` : ""}.`];
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "random"
});
