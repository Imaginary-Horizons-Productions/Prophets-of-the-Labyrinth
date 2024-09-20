const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectAllCombatants } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");

module.exports = new EnemyTemplate("Meteor Knight",
	"Fire",
	200,
	70,
	"3",
	0,
	"Armored Avalanche",
	false
).addAction({
	name: "Sonic Slash",
	element: "Fire",
	description: `Inflict ${getEmoji("Fire")} damage with Priority`,
	priority: 1,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 60;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: "random"
}).addAction({
	name: "Armored Avalanche",
	element: "Fire",
	description: `Deals ${getEmoji("Fire")} damage, with bonus damage to targets without protection`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const baseDamage = user.getPower() + 75;
		const bonusDamage = 25
		let results = [];
		for (const target of targets) {
			const pendingDamage = (isCrit ? 2 : 1) * ((target.protection > 0 ? 0 : bonusDamage) + baseDamage);
			results.push(...dealDamage([target], user, pendingDamage, false, user.element, adventure));
		}
		changeStagger(targets, "elementMatchFoe");
		return results;
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: "random"
}).addAction({
	name: "Freefall Flare-Up",
	element: "Untyped",
	description: `Grant @e{Power Up} to all combatants (friend and foe); Protects non-delvers on crit`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const empowered = addModifier(targets, { name: "Power Up", stacks: 20 });
		let protected = [];
		if (isCrit) {
			protected = addModifier(adventure.room.enemies.filter(c => c.hp > 0), { name: "protection", stacks: 50 });
		}
		if (!(empowered.length > 0 || protected.length > 0)) {
			return "But nothing happened.";
		}
		return [joinAsStatement(empowered.map(c => c.name), false, "gains", "gain", `${getApplicationEmojiMarkdown("Power Up")}!`), joinAsStatement(protected.map(c => c.name), false, "gains", "gain", "protection.")];
	},
	selector: selectAllCombatants,
	needsLivingTargets: true,
	next: "Sonic Slash"
});
