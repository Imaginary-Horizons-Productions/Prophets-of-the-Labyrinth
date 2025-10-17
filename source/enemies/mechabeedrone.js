const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectSelf, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants.js");

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
	essence: "Darkness",
	description: `Inflict minor ${getEmoji("Darkness")} damage and @e{Poison} on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 10;
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure).results.concat(addModifier(targets, { name: "Poison", stacks: user.crit ? 4 : 2 }));
	},
	selector: selectRandomFoe,
	next: "Barrel Roll"
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
	next: "Call for Help"
}).addAction({
	name: "Call for Help",
	essence: "Unaligned",
	description: "Summon another mechabee",
	priority: 0,
	effect: (targets, user, adventure) => {
		spawnEnemy(module.exports, adventure, true);
		return ["Another mechabee arrives."];
	},
	selector: selectNone,
	next: "Self-Destruct"
}).addAction({
	name: "Self-Destruct",
	essence: "Darkness",
	description: `Sacrifice self to deal large ${getEmoji("Darkness")} damage to all foes`,
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
	next: "Sting"
});
