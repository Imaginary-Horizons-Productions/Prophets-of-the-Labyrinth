const { EnemyTemplate } = require("../classes");
const { isBuff } = require("../modifiers/_modifierDictionary.js");
const { addBlock, dealDamage, addModifier } = require("../util/combatantUtil");
const { selectSelf, nextRandom, selectRandomFoe, selectAllFoes } = require("../shared/actionComponents.js");
const { isDebuff } = require("../modifiers/slow.js");
const { listifyEN } = require("../util/textUtil.js");
const { getEmoji } = require("../util/elementUtil.js");

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
	description: "Gains Block, cures a random debuff, and grants a large amount of Progress",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		user.addStagger("elementMatchAlly");
		if (isCrit) {
			addModifier(user, { name: "Progress", stacks: 60 + adventure.generateRandomNumber(46, "battle") });
		} else {
			addModifier(user, { name: "Progress", stacks: 45 + adventure.generateRandomNumber(31, "battle") });
		}
		const targetDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		let removedDebuff = null;
		if (targetDebuffs.length > 0) {
			const rolledDebuff = targetDebuffs[adventure.generateRandomNumber(targetDebuffs.length, "battle")];
			const wasRemoved = removeModifier(user, { name: rolledDebuff, stacks: "all" });
			if (wasRemoved) {
				removedDebuff = rolledDebuff;
			}
		}
		addBlock(user, 200);
		return `It gathers some materials${removedDebuff ? ` and cures itself of ${removedDebuff}` : ""}, fortifying its laboratory to Block incoming damage.`;
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: nextRandom
}).addAction({
	name: "Trouble",
	element: "Water",
	description: `Deals ${getEmoji("Water")} damage to a single foe (extra boost from Power Up) and gain a small amount of Progress`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
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
	description: `Deals ${getEmoji("Fire")} damage to all foes`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
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
	description: "Converts all foe buffs to Fire Weakness and gain Progress per buff removed",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let progressGained = adventure.generateRandomNumber(16, "battle");
		const affectedDelvers = new Set();
		if (isCrit) {
			progressGained += 10;
		}
		for (const target of targets) {
			for (let modifier in target.modifiers) {
				if (isBuff(modifier)) {
					addModifier(target, { name: "Fire Weakness", stacks: target.modifiers[modifier] });
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
			return `It cackles as it transmutes buffs on ${listifyEN([...affectedDelvers])} to Fire Weakness.`;
		} else {
			return "It's disappointed the party has no buffs to transmute.";
		}
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: nextRandom
}).setFlavorText({ name: "Progress", value: "Each time the Elkemist reaches 100 Progress, it'll gain a large amount of Power Up. Stun the Elkemist to reduce its Progress." });
