const { EnemyTemplate } = require("../classes");
const { isBuff, isDebuff } = require("../modifiers/_modifierDictionary.js");
const { dealDamage, addModifier, removeModifier, changeStagger, addProtection } = require("../util/combatantUtil");
const { selectSelf, selectRandomFoe, selectAllFoes } = require("../shared/actionComponents.js");
const { listifyEN } = require("../util/textUtil.js");
const { getEmoji } = require("../util/elementUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");

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
	description: "Gains protection, cures a random debuff, and grants a large amount of Progress",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		changeStagger([user], "elementMatchAlly");
		if (isCrit) {
			addModifier([user], { name: "Progress", stacks: 60 + adventure.generateRandomNumber(46, "battle") });
		} else {
			addModifier([user], { name: "Progress", stacks: 45 + adventure.generateRandomNumber(31, "battle") });
		}
		const resultLines = [`${user.name} gains protection.`];
		const targetDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (targetDebuffs.length > 0) {
			const rolledDebuff = targetDebuffs[adventure.generateRandomNumber(targetDebuffs.length, "battle")];
			const wasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
			if (wasRemoved) {
				resultLines.push(`${user.name} is cured of ${rolledDebuff}.`);
			}
		}
		addProtection([user], 100);
		return resultLines;
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "random",
	combatFlavor: "It gathers some materials to fortify its lab."
}).addAction({ //TODONOW finish
	name: "Trouble",
	element: "Water",
	description: `Deals ${getEmoji("Water")} damage to a single foe (extra boost from @e{Power Up}) and gain a small amount of @e{Progress}`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 75 + user.getModifierStacks("Power Up");
		if (isCrit) {
			damage *= 2;
		}
		addModifier([user], { name: "Progress", stacks: 15 + adventure.generateRandomNumber(16, "battle") });
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random",
	combatFlavor: "An obstacle to potion progress is identified and mitigated!"
}).addAction({
	name: "Boil",
	element: "Fire",
	description: `Deals ${getEmoji("Fire")} damage to all foes`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 75;
		if (isCrit) {
			damage *= 2;
		}
		return dealDamage(targets, user, damage, false, "Fire", adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random"
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
					const buffStackCount = target.modifiers[modifier];
					const removedBuff = removeModifier([target], { name: modifier, stacks: "all" }).length > 0;
					if (removedBuff) {
						progressGained += 5;
						const addedWeakness = addModifier([target], { name: "Fire Weakness", stacks: buffStackCount }).length > 0;
						if (addedWeakness && !affectedDelvers.has(target.name)) {
							affectedDelvers.add(target.name);
						}
					}
				}
			}
		}
		addModifier([user], { name: "Progress", stacks: progressGained });

		if (affectedDelvers.size > 0) {
			return [`Buffs on ${listifyEN([...affectedDelvers], false)} are transmuted to ${getApplicationEmojiMarkdown("Fire Weakness")}.`];
		} else {
			return [];
		}
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random"
}).setFlavorText({ name: "Progress", value: `Each time the Elkemist reaches 100 @e{Progress}, it'll gain a large amount of @e{Power Up}. Stun the Elkemist to reduce its @e{Progress}.` });
