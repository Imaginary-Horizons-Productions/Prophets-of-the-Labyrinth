const { EnemyTemplate, ModifierReceipt, Enemy } = require("../classes");
const { isBuff, isDebuff } = require("../modifiers/_modifierDictionary.js");
const { dealDamage, addModifier, removeModifier, changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");
const { selectSelf, selectRandomFoe, selectAllFoes } = require("../shared/actionComponents.js");
const { listifyEN } = require("../util/textUtil.js");
const { getEmoji } = require("../util/elementUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");
const { SAFE_DELIMITER } = require("../constants");

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
	description: "Gains protection, cures a random debuff, and grants a large amount of @e{Progress}",
	priority: 0,
	effect: (targets, user, adventure) => {
		changeStagger([user], "elementMatchAlly");
		const resultLines = [`${user.name} gains protection.`];
		const wrappedProgressReceipt = addModifier([user], { name: "Progress", stacks: user.roundRns[`Toil${SAFE_DELIMITER}progress`][0] });
		progressCheck(user, wrappedProgressReceipt, resultLines);
		const targetDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (targetDebuffs.length > 0) {
			const rolledDebuff = targetDebuffs[user.roundRns[`Toil${SAFE_DELIMITER}debuffs`][0] % targetDebuffs.length];
			resultLines.push(...generateModifierResultLines(removeModifier([user], { name: rolledDebuff, stacks: "all" })));
		}
		addProtection([user], 100);
		return resultLines;
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "random",
	combatFlavor: "It gathers some materials to fortify its lab.",
	rnConfig: { "debuffs": 1, "progress": { base: 30, crit: 15, random: 15 } }
}).addAction({
	name: "Trouble",
	element: "Water",
	description: `Deals ${getEmoji("Water")} damage to a single foe (extra boost from @e{Power Up}) and gain a small amount of @e{Progress}`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75 + user.getModifierStacks("Power Up");
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		const resultLines = dealDamage(targets, user, damage, false, user.element, adventure);
		const wrappedProgressReceipt = addModifier([user], { name: "Progress", stacks: user.roundRns[`Trouble${SAFE_DELIMITER}progress`][0] });
		progressCheck(user, wrappedProgressReceipt, resultLines);
		return resultLines;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random",
	combatFlavor: "An obstacle to potion progress is identified and mitigated!",
	rnConfig: { "progress": { base: 30, crit: 15, random: 15 } }
}).addAction({
	name: "Boil",
	element: "Fire",
	description: `Deals ${getEmoji("Fire")} damage to all foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75;
		if (user.crit) {
			damage *= 2;
		}
		return dealDamage(targets, user, damage, false, "Fire", adventure);
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random",
}).addAction({
	name: "Bubble",
	element: "Untyped",
	description: `Converts all foe buffs to @e{Fire Weakness} and gain @e{Progress} per buff removed`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const resultLines = [];
		let progressGained = user.roundRns[`Bubble${SAFE_DELIMITER}progress`][0];
		const removalReceipts = [];
		for (const target of targets) {
			for (let modifier in target.modifiers) {
				if (isBuff(modifier)) {
					const buffStackCount = target.modifiers[modifier];
					const receipt = removeModifier([target], { name: modifier, stacks: "all" })[0];
					removalReceipts.push(receipt);
					if (receipt.succeeded.size > 0) {
						progressGained += 5;
						addModifier([target], { name: "Fire Weakness", stacks: buffStackCount });
					}
				}
			}
		}
		const wrappedProgressReceipt = addModifier([user], { name: "Progress", stacks: progressGained });
		progressCheck(user, wrappedProgressReceipt, resultLines);
		combineModifierReceipts(removalReceipts).forEach(receipt => {
			if (receipt.succeeded.size > 0) {
				resultLines.push(`Buffs on ${listifyEN([...receipt.combatantNames])} are transmuted into ${getApplicationEmojiMarkdown("Fire Weakness")}.`);
			}
			if (receipt.failed.size > 0) {
				resultLines.push(`Buffs on ${listifyEN([...receipt.combatantNames])} were retained.`);
			}
		})
		return resultLines;
	},
	selector: selectAllFoes,
	needsLivingTargets: false,
	next: "random",
	rnConfig: { "progress": { base: 0, crit: 15, random: 15 } }
}).setFlavorText({ name: "Progress", value: `Each time the Elkemist reaches 100 @e{Progress}, it'll gain a large amount of @e{Power Up}. Stun the Elkemist to reduce its @e{Progress}.` });

/**
 * @param {Enemy} elkemist
 * @param {ModifierReceipt[]} wrappedProgressReceipt
 * @param {string[]} resultLines
 */
function progressCheck(elkemist, wrappedProgressReceipt, resultLines) {
	if (elkemist.getModifierStacks("Progress") >= 100) {
		elkemist.modifiers.Progress = 0;
		addModifier([elkemist], { name: "Power Up", stacks: 100, force: false });
		resultLines.push(`Eureka! ${elkemist.name}'s ${getApplicationEmojiMarkdown("Progress")} yields ${getApplicationEmojiMarkdown("Power Up")}!`);
	} else {
		resultLines.push(...generateModifierResultLines(wrappedProgressReceipt));
	}
}
