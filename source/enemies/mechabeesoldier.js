const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants.js");

module.exports = new EnemyTemplate("Mechabee Soldier",
	"Earth",
	175,
	100,
	"5",
	0,
	"Barrel Roll",
	false
).addAction({
	name: "Sting",
	essence: "Earth",
	description: `Inflict minor ${getEmoji("Earth")} damage and @e{Poison} on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 10;
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure).resultLines.concat(addModifier(targets, { name: "Poison", stacks: user.crit ? 4 : 2 }));
	},
	selector: selectRandomFoe,
	next: "Neurotoxin Strike"
}).addAction({
	name: "Barrel Roll",
	essence: "Unaligned",
	description: "Gain @e{Evasion}, shrug off 2 Stagger on Critical",
	priority: 0,
	effect: (targets, user, adventure) => {
		const receipts = addModifier([user], { name: "Evasion", stacks: 2 });
		if (user.crit) {
			receipts.push(...changeStagger([user], user, -2));
		}
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		return receipts;
	},
	selector: selectSelf,
	next: "Sting"
}).addAction({
	name: "Neurotoxin Strike",
	essence: "Earth",
	description: `Inflict ${getEmoji("Earth")} damage and extra Stagger on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 40;
		let pendingStagger = ESSENCE_MATCH_STAGGER_FOE + 2;
		if (user.crit) {
			pendingStagger += 2;
		}
		return dealDamage(targets, user, damage, false, user.essence, adventure).results.concat(changeStagger(targets, user, pendingStagger));
	},
	selector: selectRandomFoe,
	next: "Self-Destruct"
}).addAction({
	name: "Self-Destruct",
	essence: "Earth",
	description: `Sacrifice self to deal large ${getEmoji("Earth")} damage to all foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 125;
		if (user.crit) {
			damage *= 2;
		}
		user.hp = 0;
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure).results;
	},
	selector: selectAllFoes,
	next: "Barrel Roll"
});
