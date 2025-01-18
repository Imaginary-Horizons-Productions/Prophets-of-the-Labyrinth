const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, changeStagger } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectAllOtherCombatants } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");

module.exports = new EnemyTemplate("Asteroid",
	"Earth",
	85,
	10,
	"2",
	0,
	"Fragment",
	false
).addStartingModifier("Cowardice", 1)
	.addAction({
		name: "Fragment",
		essence: "Earth",
		description: `Inflict minor ${getEmoji("Earth")} damage on a foe and lose some HP`,
		priority: 0,
		effect: (targets, user, adventure) => {
			let damage = user.getPower() + 30;
			const recoilDmg = 20;
			if (user.crit) {
				damage *= 2;
			}
			changeStagger(targets, ESSENCE_MATCH_STAGGER_FOE);
			return dealDamage(targets, user, damage, false, user.essence, adventure).concat(dealDamage([user], user, recoilDmg, true, "Unaligned", adventure));
		},
		selector: selectRandomFoe,
		next: "random"
	}).addAction({
		name: "Bolide Burst",
		essence: "Earth",
		description: `Sacrifice remaining HP to deal that much ${getEmoji("Earth")} damage to all foes`,
		priority: 0,
		effect: (targets, user, adventure) => {
			let damage = user.getPower() + user.hp;
			if (user.crit) {
				damage *= 2;
			}
			user.hp = 0;
			changeStagger(targets, ESSENCE_MATCH_STAGGER_FOE);
			return [...dealDamage(targets, user, damage, false, user.essence, adventure), `${user.name} is downed.`];
		},
		selector: selectAllOtherCombatants,
		next: "random"
	});
