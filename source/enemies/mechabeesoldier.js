const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil.js");
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
	description: `Inflict minor ${getEmoji("Earth")} damage and @e{Poison} on a single foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 10;
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure).concat(generateModifierResultLines(addModifier(targets, { name: "Poison", stacks: user.crit ? 4 : 2 })));
	},
	selector: selectRandomFoe,
	next: "Neurotoxin Strike"
}).addAction({
	name: "Barrel Roll",
	essence: "Unaligned",
	description: "Gain @e{Evade}, shrug off 2 Stagger on Critical Hit",
	priority: 0,
	effect: (targets, user, adventure) => {
		const receipts = addModifier([user], { name: "Evade", stacks: 2 });
		const resultLines = [];
		let pendingStagger = ESSENCE_MATCH_STAGGER_ALLY;
		if (user.crit) {
			pendingStagger += 2;
			resultLines.push(`${user.name} shrugs off some Stagger.`);
		}
		changeStagger([user], user, pendingStagger);
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	},
	selector: selectSelf,
	next: "Sting"
}).addAction({
	name: "Neurotoxin Strike",
	essence: "Earth",
	description: `Inflict ${getEmoji("Earth")} damage and extra Stagger on a single foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 40;
		let pendingStagger = ESSENCE_MATCH_STAGGER_FOE + 2;
		if (user.crit) {
			pendingStagger += 2;
		}
		changeStagger(targets, user, pendingStagger);
		return dealDamage(targets, user, damage, false, user.essence, adventure);
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

		return dealDamage(targets, user, damage, false, user.essence, adventure);
	},
	selector: selectAllFoes,
	next: "Barrel Roll"
});
