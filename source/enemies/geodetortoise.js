const { EnemyTemplate } = require("../classes");
const { addModifier, dealDamage, changeStagger, addProtection } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants.js");

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
	essence: "Earth",
	description: `Deals ${getEmoji("Earth")} damage to a single foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 50;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure);
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Crystallize",
	essence: "Unaligned",
	description: `Gain protection and @e{Power Up}`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let addedPowerUp = false;
		addProtection([user], 25);
		if (user.crit) {
			addedPowerUp = addModifier([user], { name: "Power Up", stacks: 50 }).some(receipt => receipt.succeeded.size > 0);
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		} else {
			addedPowerUp = addModifier([user], { name: "Power Up", stacks: 25 }).some(receipt => receipt.succeeded.size > 0);
		}
		return [`${user.name} gains protection${addedPowerUp ? ` and ${getApplicationEmojiMarkdown("Power Up")}` : ` but was oblivious to ${getApplicationEmojiMarkdown("Power Up")}`}.`];
	},
	selector: selectSelf,
	next: "random"
});
