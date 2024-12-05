const { EnemyTemplate } = require("../classes");
const { addModifier, dealDamage, changeStagger, addProtection } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");
const { ELEMENT_MATCH_STAGGER_FOE, ELEMENT_MATCH_STAGGER_ALLY } = require("../constants.js");

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
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 50;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Crystallize",
	element: "Untyped",
	description: `Gain protection and @e{Power Up}`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let addedPowerUp = false;
		addProtection([user], 25);
		if (user.crit) {
			addedPowerUp = addModifier([user], { name: "Power Up", stacks: 50 }).some(receipt => receipt.succeeded.size > 0);
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		} else {
			addedPowerUp = addModifier([user], { name: "Power Up", stacks: 25 }).some(receipt => receipt.succeeded.size > 0);
		}
		return [`${user.name} gains protection${addedPowerUp ? ` and ${getApplicationEmojiMarkdown("Power Up")}` : ` but was oblivious to ${getApplicationEmojiMarkdown("Power Up")}`}.`];
	},
	selector: selectSelf,
	next: "random"
});
