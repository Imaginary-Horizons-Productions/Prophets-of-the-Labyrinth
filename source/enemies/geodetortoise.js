const { EnemyTemplate } = require("../classes");
const { addModifier, dealDamage, changeStagger, addProtection, generateModifierResultLines } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
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
		return dealDamage(targets, user, damage, false, user.essence, adventure).resultLines;
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Crystallize",
	essence: "Unaligned",
	description: `Gain protection and @e{Empowerment}`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const pendingEmpowerment = { name: "Empowerment", stacks: 25 };
		addProtection([user], 25);
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		if (user.crit) {
			pendingEmpowerment.stacks *= 2;
		}
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(addModifier([user], pendingEmpowerment)));
	},
	selector: selectSelf,
	next: "random"
});
