const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { concatTeamMembersWithModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
const { scalingSwiftness } = require('./shared/modifiers');

//#region Base
const watersStillness = new GearTemplate("Water's Stillness",
	[
		["use", "Relieve Stagger for an ally and all allies with @{mod0}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(200)
	.setEffect(watersStillnessEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof watersStillness.effect} */
function watersStillnessEffect(targets, user, adventure) {
	const { essence, modifiers: [targetModifier], stagger, scalings: { critBonus } } = watersStillness;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
	let pendingStaggerRelief = stagger;
	if (user.essence === essence) {
		pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
	}
	if (user.crit) {
		pendingStaggerRelief *= critBonus;
	}
	changeStagger(allTargets, user, pendingStaggerRelief);
	return [joinAsStatement(false, allTargets.map(target => target.name), "shrugs off", "shrug off", "some Stagger.")];
}
//#endregion Base

//#region Accelerating
const acceleratingWatersStillness = new GearTemplate("Accelerating Water's Stillness",
	[
		["use", "Relieve Stagger and grant <@{mod1Stacks}> @{mod1} to an ally and all allies with @{mod0}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect(acceleratingWatersStillnessEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 }, scalingSwiftness(2))
	.setScalings({ critBonus: 2 });

/** @type {typeof acceleratingWatersStillness.effect} */
function acceleratingWatersStillnessEffect(targets, user, adventure) {
	const { essence, modifiers: [targetModifier, swiftness], stagger, scalings: { critBonus } } = acceleratingWatersStillness;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
	let pendingStaggerRelief = stagger;
	if (user.essence === essence) {
		pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
	}
	if (user.crit) {
		pendingStaggerRelief *= critBonus;
	}
	changeStagger(allTargets, user, pendingStaggerRelief);
	return [joinAsStatement(false, allTargets.map(target => target.name), "shrugs off", "shrug off", "some Stagger.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, { name: swiftness.name, stacks: swiftness.stacks.calculate(user) }))));
}
//#endregion Accelerating

//#region Cleansing
const variantName = "Cleansing Water's Stillness";
const cleansingWatersStillness = new GearTemplate("Cleansing Water's Stillness",
	[
		["use", "Relieve Stagger and cure @{debuffsCured} random debuff for an ally and all allies with @{mod0}"],
		["critical", "Stagger relieved x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect(cleansingWatersStillnessEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setStagger(-2)
	.setModifiers({ name: "Vigilance", stacks: 0 })
	.setScalings({
		debuffsCured: 1,
		critBonus: 2
	})
	.setRnConfig({ debuffs: 1 });

/** @type {typeof cleansingWatersStillness.effect} */
function cleansingWatersStillnessEffect(targets, user, adventure) {
	const { essence, modifiers: [targetModifier], stagger, scalings: { debuffsCured, critBonus } } = cleansingWatersStillness;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
	let pendingStaggerRelief = stagger;
	if (user.essence === essence) {
		pendingStaggerRelief += ESSENCE_MATCH_STAGGER_ALLY;
	}
	if (user.crit) {
		pendingStaggerRelief *= critBonus;
	}
	changeStagger(allTargets, user, pendingStaggerRelief);
	const receipts = [];
	for (const target of targets) {
		const targetDebuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const debuffsToRemove = Math.min(targetDebuffs.length, debuffsCured);
		for (let i = 0; i < debuffsToRemove; i++) {
			const [rolledDebuff] = targetDebuffs.splice(user.roundRns[`${variantName}${SAFE_DELIMITER}debuffs`][i] % targetDebuffs.length, 1);
			receipts.push(...removeModifier([target], { name: rolledDebuff, stacks: "all" }));
		}
	}
	return [joinAsStatement(false, allTargets.map(target => target.name), "shrugs off", "shrug off", "some Stagger.")].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
}
//#endregion Cleansing

module.exports = new GearFamily(watersStillness, [acceleratingWatersStillness, cleansingWatersStillness], false);
