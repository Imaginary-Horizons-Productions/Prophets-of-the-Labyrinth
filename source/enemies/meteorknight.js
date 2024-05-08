const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, addModifier, changeStagger, addProtection } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectNone } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

const PATTERN = {
	"Armored Avalanche": "random",
	"Freefall Flare-Up": "Armored Avalanche", // every other turn at most (avg every 3 ish turns)
	"Sonic Slash": "Armored Avalanche"
}
function meteorKnightPattern(actionName) {
	return PATTERN[actionName]
}

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
		let damage = user.getPower() + 40;
		if (isCrit) {
			damage *= 2;
		} changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: meteorKnightPattern
}).addAction({
	name: "Armored Avalanche",
	element: "Fire",
	description: "Increases protection of target by up to 50%, then deals large damage, and receives recoil proportional to damage blocked",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 85;
		if (isCrit) {
			damage *= 2;
		}
		// Targets get increased efficiency for protection against this attack because they're particularly "braced" for it. Won't provide excess protection, though.
		let protectedCombatants = [];
		let totalProt = 0;
		for (const target of targets) {
			let pendingProt = Math.max(0, damage - 0.5 * target.modifiers["protection"]);
			if (target.modifiers.hasOwnProperty("protection") && pendingProt > 0) {
				addProtection(target, pendingProt);
				protectedCombatants.push(target);
				totalProt += target.modifiers["protection"];
			}
		}
		const recoilDmg = Math.min(totalProt, damage) / 2; // half the value of armor applied against damage
		changeStagger([targets], "elementMatchFoe");
		return `${protectedCombatants ? joinAsStatement(protectedCombatants.map(c => c.name), false, "is", "were", "braced for the charge!") : ""}${dealDamage(targets, user, damage, false, user.element, adventure)}${recoilDmg ? user + " was repelled!" + dealDamage([user], user, recoilDmg, false, user.element, adventure) : ""}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: true,
	next: meteorKnightPattern
}).addAction({
	name: "Freefall Flare-Up",
	element: "Untyped",
	description: "Powers up all combatants (friend and foe); Protects non-delvers on crit",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const empowered = addModifier(adventure.delvers.concat(adventure.room.enemies).filter(c => c.hp > 0), { name: "Power Up", stacks: 50 });
		let protected;
		if (isCrit) {
			protected = addModifier(adventure.room.enemies.filter(c => c.hp > 0), { name: "Protection", stacks: 50 });
		}
		if (!(empowered || protected)) {
			return "But nothing happened.";
		}
		return `${joinAsStatement(empowered.map(c => c.name), false, "was", "were", "Powered Up!") + joinAsStatement(protected.map(c => c.name), false, "was", "were", "Protected.")}`;
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: meteorKnightPattern
});
