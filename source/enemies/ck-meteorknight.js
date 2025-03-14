const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, changeStagger, addProtection, generateModifierResultLines, addModifier } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require("../constants.js");
const { spawnEnemy } = require("../util/roomUtil.js");

module.exports = new EnemyTemplate("Meteor Knight",
	"Fire",
	280,
	70,
	"3",
	0,
	"Armored Avalanche",
	false
).addAction({
	name: "Sonic Slash",
	essence: "Fire",
	description: `Deal ${getEmoji("Fire")} damage to a foe with priority`,
	priority: 1,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 60;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure).resultLines;
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Armored Avalanche",
	essence: "Fire",
	description: `Deal ${getEmoji("Fire")} damage to a foe, deal extra if they don't have protection`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const baseDamage = user.getPower() + 75;
		const bonusDamage = 25
		const resultLines = [];
		for (const target of targets) {
			const pendingDamage = (user.crit ? 2 : 1) * ((target.protection > 0 ? 0 : bonusDamage) + baseDamage);
			resultLines.push(...dealDamage([target], user, pendingDamage, false, user.essence, adventure).resultLines);
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines;
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Meteor Mayhem",
	essence: "Fire",
	description: `Inflict random @e{Misfortune} to all foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		pendingMisfortune = user.roundRns[`Meteor Mayhem${SAFE_DELIMITER}Meteor Mayhem`][0];
		if (user.crit) {
			addProtection([user], 25);
			resultLines.push(`${user.name} gains protection.`);
		}
		const { resultLines, survivors } = dealDamage(targets, user, user.getPower() + 5, false, "Fire", adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(addModifier(survivors, { name: "Misfortune", stacks: pendingMisfortune })));
	},
	selector: selectAllFoes,
	next: "random",
	rnConfig: { "Meteor Mayhem": 1 }
});
