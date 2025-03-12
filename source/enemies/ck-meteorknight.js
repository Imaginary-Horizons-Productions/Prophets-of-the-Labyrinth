const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, changeStagger, addProtection } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectNone } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");
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
	name: "Call Asteroid",
	essence: "Unaligned",
	description: "Summon an Asteroid, gain protection on Critical",
	priority: 0,
	effect: (targets, user, adventure) => {
		if (user.crit) {
			addProtection([user], 25);
		}
		spawnEnemy(asteroid, adventure);
		return ["An Asteroid arrives on the battlefield."];
	},
	selector: selectNone,
	next: "Sonic Slash"
});
