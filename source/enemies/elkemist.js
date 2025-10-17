const { EnemyTemplate, Enemy, Receipt } = require("../classes");
const { getModifierCategory } = require("../modifiers/_modifierDictionary.js");
const { dealDamage, addModifier, removeModifier, changeStagger, addProtection } = require("../util/combatantUtil");
const { selectSelf, selectRandomFoe, selectAllFoes } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require("../constants");

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
	essence: "Unaligned",
	description: "Gain protection, cure a random debuff, and gain a large amount of @e{Progress}",
	priority: 0,
	effect: (targets, user, adventure) => {
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		const resultLines = [`${user.name} gains protection.`];
		const wrappedProgressReceipt = addModifier([user], { name: "Progress", stacks: user.roundRns[`Toil${SAFE_DELIMITER}progress`][0] });
		progressCheck(user, wrappedProgressReceipt, resultLines);
		const targetDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		if (targetDebuffs.length > 0) {
			const rolledDebuff = targetDebuffs[user.roundRns[`Toil${SAFE_DELIMITER}debuffs`][0] % targetDebuffs.length];
			resultLines.push(...removeModifier([user], { name: rolledDebuff, stacks: "all" }));
		}
		addProtection([user], 100);
		return resultLines;
	},
	selector: selectSelf,
	next: "random",
	combatFlavor: "It gathers some materials to fortify its lab.",
	rnConfig: { "debuffs": 1, "progress": { base: 30, crit: 15, random: 15 } }
}).addAction({
	name: "Trouble",
	essence: "Water",
	description: `Deal ${getEmoji("Water")} damage to a foe (extra boost from @e{Empowerment}) and gain a small amount of @e{Progress}`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75 + user.getModifierStacks("Empowerment");
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		const results = dealDamage(targets, user, damage, false, user.essence, adventure).results;
		const wrappedProgressReceipt = addModifier([user], { name: "Progress", stacks: user.roundRns[`Trouble${SAFE_DELIMITER}progress`][0] });
		progressCheck(user, wrappedProgressReceipt, results);
		return results;
	},
	selector: selectRandomFoe,
	next: "random",
	combatFlavor: "An obstacle to potion progress is identified and mitigated!",
	rnConfig: { "progress": { base: 30, crit: 15, random: 15 } }
}).addAction({
	name: "Boil",
	essence: "Fire",
	description: `Deal ${getEmoji("Fire")} damage to all foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 75;
		if (user.crit) {
			damage *= 2;
		}
		return dealDamage(targets, user, damage, false, "Fire", adventure).results;
	},
	selector: selectAllFoes,
	next: "random",
}).addAction({
	name: "Bubble",
	essence: "Unaligned",
	description: `Convert all foe buffs to @e{Fire Vulnerability} and gain @e{Progress} per buff removed`,
	priority: 0,
	effect: (targets, user, adventure) => {
		const results = [];
		let progressGained = user.roundRns[`Bubble${SAFE_DELIMITER}progress`][0];
		for (const target of targets) {
			for (let modifier in target.modifiers) {
				if (getModifierCategory(modifier) === "Buff") {
					const buffStackCount = target.modifiers[modifier];
					const receipt = removeModifier([target], { name: modifier, stacks: "all" })[0];
					results.push(receipt);
					if (receipt.removedModifiers.size > 0) {
						progressGained += 5;
						results.push(...addModifier([target], { name: "Fire Vulnerability", stacks: buffStackCount }));
					}
				}
			}
		}
		const wrappedProgressReceipt = addModifier([user], { name: "Progress", stacks: progressGained });
		progressCheck(user, wrappedProgressReceipt, results);
		return results;
	},
	selector: selectAllFoes,
	next: "random",
	rnConfig: { "progress": { base: 0, crit: 15, random: 15 } }
}).setFlavorText({ name: "Progress", value: `Each time the Elkemist reaches 100 @e{Progress}, it'll gain a large amount of @e{Empowerment} and @e{Excellence}. Stun the Elkemist to reduce its @e{Progress}.` });

/**
 * @param {Enemy} elkemist
 * @param {Receipt[]} wrappedProgressReceipt
 * @param {string[]} resultLines
 */
function progressCheck(elkemist, wrappedProgressReceipt, resultLines) {
	if (elkemist.getModifierStacks("Progress") >= 100) {
		elkemist.modifiers.Progress = 0;
		addModifier([elkemist], { name: "Empowerment", stacks: 100 });
		addModifier([elkemist], { name: "Excellence", stacks: 5 });
		resultLines.push(`Eureka! ${elkemist.name}'s ${getApplicationEmojiMarkdown("Progress")} yields ${getApplicationEmojiMarkdown("Empowerment")}${getApplicationEmojiMarkdown("Excellence")}!`);
	} else {
		resultLines.push(...wrappedProgressReceipt);
	}
}
