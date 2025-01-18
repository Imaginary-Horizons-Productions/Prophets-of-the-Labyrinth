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
	description: `Deal ${getEmoji("Earth")} damage to a foe`,
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
	description: `Gain protection and @e{Empowerment}`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let addedEmpowerment = false;
		addProtection([user], 25);
		if (user.crit) {
			addedEmpowerment = addModifier([user], { name: "Empowerment", stacks: 50 }).some(receipt => receipt.succeeded.size > 0);
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		} else {
			addedEmpowerment = addModifier([user], { name: "Empowerment", stacks: 25 }).some(receipt => receipt.succeeded.size > 0);
		}
		return [`${user.name} gains protection${addedEmpowerment ? ` and ${getApplicationEmojiMarkdown("Empowerment")}` : ` but was oblivious to ${getApplicationEmojiMarkdown("Empowerment")}`}.`];
	},
	selector: selectSelf,
	next: "random"
});
