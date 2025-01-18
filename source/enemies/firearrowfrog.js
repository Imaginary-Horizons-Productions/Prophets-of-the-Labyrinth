const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil.js");

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
	essence: "Fire",
	description: `Inflict minor ${getEmoji("Fire")} damage and @e{Poison} on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 20;
		const resultLines = dealDamage(targets, user, damage, false, user.essence, adventure);
		return resultLines.concat(generateModifierResultLines(addModifier(targets, { name: "Poison", stacks: user.crit ? 6 : 3 })));
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Burrow",
	essence: "Unaligned",
	description: "Gain @e{Evasion}",
	priority: 0,
	effect: (targets, user, adventure) => {
		let stacks = 2;
		if (user.crit) {
			stacks *= 3;
		}
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		return generateModifierResultLines(addModifier([user], { name: "Evasion", stacks }));
	},
	selector: selectSelf,
	next: "Venom Cannon"
}).addAction({
	name: "Goop Spray",
	essence: "Unaligned",
	description: "Inflict @e{Torpidity} on a foe",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: "Torpidity", stacks: user.crit ? 3 : 2 })));
	},
	selector: selectRandomFoe,
	next: "Venom Cannon"
});
