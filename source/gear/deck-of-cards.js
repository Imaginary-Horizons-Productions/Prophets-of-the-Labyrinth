const { GearTemplate, GearFamily, Scaling } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, generateModifierResultLines, addModifier, getCombatantCounters, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

/** @type {(variantName: string) => ({ name: "Misfortune", stacks: Scaling })} */
function deckOfCardsMisfortune(variantName) {
	return {
		name: "Misfortune", stacks: {
			description: "a random amount between 2 and 6", calculate: (user) => {
				if (`${variantName}${SAFE_DELIMITER}Deck of Cards` in user.roundRns) {
					return 2 + user.roundRns[`${variantName}${SAFE_DELIMITER}Deck of Cards`][0];
				} else {
					return "a random amount between 2 and 6";
				}
			}
		}
	};
}


//#region Base
const baseName = "Deck of Cards";
const deckOfCards = new GearTemplate(baseName,
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind",
).setEffect(deckOfCardsEffect, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(baseName))
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });

/** @type {typeof deckOfCards.effect} */
function deckOfCardsEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune] } = deckOfCards;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) })));
}
//#endregion Base

//#region Evasive
const evasiveName = "Evasive Deck of Cards";
const evasiveDeckOfCards = new GearTemplate(evasiveName,
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe and gain @{mod1Stacks} @{mod1}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect(evasiveDeckOfCardsEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers(deckOfCardsMisfortune(evasiveName), { name: "Evasion", stacks: 2 })
	.setRnConfig({ ["Deck of Cards"]: 1 });

/** @type {typeof evasiveDeckOfCards.effect} */
function evasiveDeckOfCardsEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune, evasion] } = evasiveDeckOfCards;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) }).concat(addModifier([user], evasion))));
}
//#endregion Evasive

//#region Numbing
const numbingName = "Numbing Deck of Cards";
const numbingDeckOfCards = new GearTemplate(numbingName,
	[
		["use", "Inflict <@{damage}> @{essence} damage, @{mod1Stacks} @{mod1}, and <@{mod0Stacks}> @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect(numbingDeckOfCardsEffect, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(numbingName), { name: "Clumsiness", stacks: 1 })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });

/** @type {typeof numbingDeckOfCards.effect} */
function numbingDeckOfCardsEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune, clumsiness] } = numbingDeckOfCards;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) }).concat(addModifier(survivors, clumsiness))));
}
//#endregion Numbing

//#region Omenous
const omenousName = "Omenous Deck of Cards";
const omenousDeckOfCards = new GearTemplate(omenousName,
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} (doubled if Essence Countering) on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect(omenousDeckOfCardsEffect, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(omenousName))
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });

/** @type {typeof omenousDeckOfCards.effect} */
function omenousDeckOfCardsEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune] } = omenousDeckOfCards;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let misfortuneStacks = misfortune.stacks.calculate(user);
		if (getCombatantCounters(survivors[0]).includes(essence)) {
			misfortuneStacks *= 2;
		}
		resultLines.push(...generateModifierResultLines(addModifier(survivors, { name: misfortune.name, stacks: misfortuneStacks })))
	}
	return resultLines;
}
//#endregion Omenous

//#region Tormenting
const tormentingName = "Tormenting Deck of Cards";
const tormentingDeckOfCards = new GearTemplate(tormentingName,
	[
		["use", "Deal <@{damage}> @{essence} damage, increase debuff stacks by @{debuffIncrement}, and inflict <@{mod0Stacks}> @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect(tormentingDeckOfCardsEffect, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(tormentingName))
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		debuffIncrement: 1
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });

/** @type {typeof tormentingDeckOfCards.effect} */
function tormentingDeckOfCardsEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus, debuffIncrement }, modifiers: [misfortune] } = tormentingDeckOfCards;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const receipts = [];
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		for (const target of survivors) {
			for (const modifier in target.modifiers) {
				if (getModifierCategory(modifier) === "Debuff") {
					receipts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
				}
			}
		}
	}
	receipts.push(...addModifier(survivors, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) }));
	return resultLines.concat(generateModifierResultLines(receipts));
}
//#endregion Tormenting

module.exports = new GearFamily(deckOfCards, [evasiveDeckOfCards, numbingDeckOfCards, omenousDeckOfCards, tormentingDeckOfCards], true);
