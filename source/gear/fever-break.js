const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, removeModifier, changeStagger, addModifier } = require('../util/combatantUtil');
const { unstoppablePassive } = require('./shared/passiveDescriptions');

//#region Base
const feverBreak = new GearTemplate("Fever Break",
	[
		["use", `Deal <pending damage from @{mod0} and @{mod1}> @{essence} damage to all foes, then cure them of those debuffs`],
		["critical", "@{mod0} and @{mod1} are not removed"]
	],
	"Maneuver",
	"Darkness"
).setCost(200)
	.setEffect(feverBreakEffect, { type: "all", team: "foe" })
	.setUpgrades("Fatiguing Fever Break", "Unstoppable Fever Break")
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frailty", stacks: 0 })
	.setMoraleRequirement(2);

/** @type {typeof feverBreak.effect} */
function feverBreakEffect(targets, user, adventure) {
	const { essence, moraleRequirement } = feverBreak;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	let poisonDamage = 10;
	let frailDamage = 20;
	if (user.team === "delver") {
		const FUNNEL_BUFF = 2;
		const funnelCount = adventure.getArtifactCount("Spiral Funnel");
		poisonDamage += FUNNEL_BUFF * funnelCount;
		frailDamage += FUNNEL_BUFF * funnelCount;
	}
	const resultLines = [];
	const survivors = [];
	const receipts = [];
	for (const target of targets) {
		const poisonStacks = target.getModifierStacks("Poison");
		const frailtyStacks = target.getModifierStacks("Frailty");
		const pendingDamage = poisonDamage * (poisonStacks ** 2 + poisonStacks) / 2 + frailDamage * frailtyStacks;
		resultLines.push(...dealDamage([target], user, pendingDamage, false, essence, adventure).resultLines);
		if (target.hp > 0) {
			survivors.push(target);
			if (!user.crit) {
				receipts.push(...removeModifier([target], { name: "Poison", stacks: "all" }).concat(removeModifier([target], { name: "Frailty", stacks: "all" })));
			}
		}
	}
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(receipts);
}
//#endregion Base

//#region Fatiguing
const fatiguingFeverBreak = new GearTemplate("Fatiguing Fever Break",
	[
		["use", `Inflict all foes with <pending damage from @{mod0} and @{mod1}> @{essence} damage and @{mod2Stacks} @{mod2}, then cure them of those debuffs`],
		["critical", "@{mod0} and @{mod1} are not removed"]
	],
	"Maneuver",
	"Darkness"
).setCost(350)
	.setEffect(fatiguingFeverBreakEffect, { type: "all", team: "foe" })
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frailty", stacks: 0 }, { name: "Impotence", stacks: 2 })
	.setMoraleRequirement(2);

/** @type {typeof fatiguingFeverBreak.effect} */
function fatiguingFeverBreakEffect(targets, user, adventure) {
	const { essence, moraleRequirement, modifiers } = fatiguingFeverBreak;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	let poisonDamage = 10;
	let frailDamage = 20;
	if (user.team === "delver") {
		const FUNNEL_BUFF = 2;
		const funnelCount = adventure.getArtifactCount("Spiral Funnel");
		poisonDamage += FUNNEL_BUFF * funnelCount;
		frailDamage += FUNNEL_BUFF * funnelCount;
	}
	const resultLines = [];
	const survivors = [];
	const receipts = [];
	for (const target of targets) {
		const poisonStacks = target.getModifierStacks("Poison");
		const frailtyStacks = target.getModifierStacks("Frailty");
		const pendingDamage = poisonDamage * (poisonStacks ** 2 + poisonStacks) / 2 + frailDamage * frailtyStacks;
		resultLines.push(...dealDamage([target], user, pendingDamage, false, essence, adventure).resultLines);
		if (target.hp > 0) {
			survivors.push(target);
			if (!user.crit) {
				receipts.push(...removeModifier([target], { name: "Poison", stacks: "all" }).concat(removeModifier([target], { name: "Frailty", stacks: "all" })));
			}
		}
	}
	receipts.push(...addModifier(survivors, modifiers[2]));
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(receipts);
}
//#endregion Fatiguing

//#region Unstoppable
const unstoppableFeverBreak = new GearTemplate("Unstoppable Fever Break",
	[
		unstoppablePassive,
		["use", `Deal <pending damage from @{mod0} and @{mod1}> @{essence} damage to all foes, then cure them of those debuffs`],
		["critical", "@{mod0} and @{mod1} are not removed"]
	],
	"Maneuver",
	"Darkness"
).setCost(350)
	.setEffect(unstoppableFeverBreakEffect, { type: "all", team: "foe" })
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frailty", stacks: 0 })
	.setMoraleRequirement(2);

/** @type {typeof unstoppableFeverBreak.effect} */
function unstoppableFeverBreakEffect(targets, user, adventure) {
	const { essence, moraleRequirement } = unstoppableFeverBreak;
	if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
		return ["...but the party didn't have enough morale to pull it off."];
	}

	let poisonDamage = 10;
	let frailDamage = 20;
	if (user.team === "delver") {
		const FUNNEL_BUFF = 2;
		const funnelCount = adventure.getArtifactCount("Spiral Funnel");
		poisonDamage += FUNNEL_BUFF * funnelCount;
		frailDamage += FUNNEL_BUFF * funnelCount;
	}
	const resultLines = [];
	const survivors = [];
	const receipts = [];
	for (const target of targets) {
		const poisonStacks = target.getModifierStacks("Poison");
		const frailtyStacks = target.getModifierStacks("Frailty");
		const pendingDamage = poisonDamage * (poisonStacks ** 2 + poisonStacks) / 2 + frailDamage * frailtyStacks;
		resultLines.push(...dealDamage([target], user, pendingDamage, true, essence, adventure).resultLines);
		if (target.hp > 0) {
			survivors.push(target);
			if (!user.crit) {
				receipts.push(...removeModifier([target], { name: "Poison", stacks: "all" }).concat(removeModifier([target], { name: "Frailty", stacks: "all" })));
			}
		}
	}
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(receipts);
}
//#endregion Unstoppable

module.exports = new GearFamily(feverBreak, [fatiguingFeverBreak, unstoppableFeverBreak], false);
