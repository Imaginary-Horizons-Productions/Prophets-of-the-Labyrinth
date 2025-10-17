const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { addModifier, dealDamage, changeStagger, removeModifier } = require('../util/combatantUtil');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const waveCrash = new GearTemplate("Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a foe"],
		["critical", "Deal <@{damage}> @{essence} damage"]
	],
	"Adventuring",
	"Water"
).setCost(200)
	.setEffect(waveCrashEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 })
	.setScalings({ damage: damageScalingGenerator(40) });

/** @type {typeof waveCrash.effect} */
function waveCrashEffect(targets, user, adventure) {
	const { essence, modifiers: [incompatibility], scalings: { damage } } = waveCrash;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const results = addModifier(targets, incompatibility);
	if (user.crit) {
		results.push(...dealDamage(targets, user, damage.calculate(user), false, essence, adventure).results);
	}
	return results;
}
//#endregion Base

//#region Disenchanting
const disenchantingWaveCrash = new GearTemplate("Disenchanting Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and remove @{buffsRemoved} random buff from a foe"],
		["critical", "Deal <@{damage}> @{essence} damage"]
	],
	"Adventuring",
	"Water"
).setCost(350)
	.setEffect(disenchantingWaveCrashEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 })
	.setScalings({
		damage: damageScalingGenerator(40),
		buffsRemoved: 1
	})
	.setRnConfig({ buffs: 1 });

/** @type {typeof disenchantingWaveCrash.effect} */
function disenchantingWaveCrashEffect(targets, user, adventure) {
	const { essence, modifiers: [incompatibility], scalings: { damage } } = disenchantingWaveCrash;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const results = addModifier(targets, incompatibility);
	const targetBuffs = Object.keys(targets[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
	if (targetBuffs.length > 0) {
		for (let i = 0; i < pendingBuffRemovals; i++) {
			const [selectedBuff] = targetBuffs.splice(user.roundRns(`${disenchantingWaveCrash.name}${SAFE_DELIMITER}buffs`), 1);
			results.push(...removeModifier(targets, { name: selectedBuff, stacks: "all" }));
		}
	}
	if (user.crit) {
		results.push(...dealDamage(targets, user, damage.calculate(user), false, essence, adventure).results);
	}
	return results;
}
//#endregion Disenchanting

//#region Fatiguing
const fatiguingWaveCrash = new GearTemplate("Fatiguing Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a foe"],
		["critical", "Deal <@{damage}> @{essence} damage"]
	],
	"Adventuring",
	"Water"
).setCost(350)
	.setEffect(fatiguingWaveCrashEffect, { type: "single", team: "foe" })
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 }, { name: "Impotence", stacks: 3 })
	.setScalings({ damage: damageScalingGenerator(40) });

/** @type {typeof fatiguingWaveCrash.effect} */
function fatiguingWaveCrashEffect(targets, user, adventure) {
	const { essence, modifiers: [incompatibility, impotence], scalings: { damage } } = fatiguingWaveCrash;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const results = addModifier(targets, incompatibility).concat(addModifier(targets, impotence));
	if (user.crit) {
		results.push(...dealDamage(targets, user, damage.calculate(user), false, essence, adventure).results);
	}
	return results;
}
//#endregion Fatiguing

module.exports = new GearFamily(waveCrash, [disenchantingWaveCrash, fatiguingWaveCrash], false);
