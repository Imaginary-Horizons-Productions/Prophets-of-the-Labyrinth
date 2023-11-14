const { EnemyTemplate } = require("../classes");
const { isBuff } = require("../modifiers/_modifierDictionary.js");
const { addBlock, dealDamage, addModifier } = require("../util/combatantUtil");
const { selectSelf, nextRandom, selectRandomFoe, selectAllFoes } = require("../shared/actionComponents.js");

module.exports = new EnemyTemplate("Elkemist",
	"Water",
	2000,
	100,
	"n*4",
	0,
	"random",
	true
).addAction({
	name: "Toil",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		// Gain block and medium progress
		user.addStagger("elementMatchAlly");
		if (isCrit) {
			addModifier(user, { name: "Progress", stacks: 60 + adventure.generateRandomNumber(46, "battle") });
		} else {
			addModifier(user, { name: "Progress", stacks: 45 + adventure.generateRandomNumber(31, "battle") });
		}
		addBlock(user, 200);
		return "It gathers some materials, fortifying its laboratory to Block incoming damage.";
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: nextRandom
}).addAction({
	name: "Trouble",
	element: "Water",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		// Damage a single foe and small progress
		let damage = 75 + user.getModifierStacks("Power Up");
		if (isCrit) {
			damage *= 2;
		}
		addModifier(user, { name: "Progress", stacks: 15 + adventure.generateRandomNumber(16, "battle") });
		target.addStagger("elementMatchFoe");
		return `An obstacle to potion progress is identified and mitigated; ${dealDamage([target], user, damage, false, user.element, adventure)}`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: nextRandom
}).addAction({
	name: "Boil",
	element: "Fire",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		// Fire damage to all foes
		let damage = 75;
		if (isCrit) {
			damage *= 2;
		}
		return dealDamage(targets, user, damage, false, "Fire", adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: nextRandom
}).addAction({
	name: "Bubble",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		// Remove buffs from all foes and gain progress per removed
		let progressGained = adventure.generateRandomNumber(16, "battle");
		const affectedDelvers = new Set();
		if (isCrit) {
			progressGained += 10;
		}
		for (const target of targets) {
			for (let modifier in target.modifiers) {
				if (isBuff(modifier)) {
					delete target.modifiers[modifier];
					progressGained += 5;
					if (!affectedDelvers.has(target.name)) {
						affectedDelvers.add(target.name);
					}
				}
			}
		}
		addModifier(user, { name: "Progress", stacks: progressGained });

		if (affectedDelvers.size > 0) {
			return `It cackles as it nullifies buffs on ${[...affectedDelvers].join(", ")}.`;
		} else {
			return "It's disappointed the party has no buffs to nullify.";
		}
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: nextRandom
});
