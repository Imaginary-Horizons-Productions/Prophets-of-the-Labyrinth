const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger, generateModifierResultLines, addModifier, downedCheck } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

//#region Base
const lifeDrain = new GearTemplate("Life Drain",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and regain <@{healing}> HP"],
		["critical", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(lifeDrainEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		healing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) }
	});

/** @type {typeof lifeDrain.effect} */
function lifeDrainEffect(targets, user, adventure) {
	const { essence, scalings: { damage, healing, critBonus } } = lifeDrain;
	let pendingHealing = healing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(gainHealth(user, pendingHealing, adventure));
}
//#endregion Base

//#region Fatiguing
const fatiguingLifeDrain = new GearTemplate("Fatiguing Life Drain",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe and regain <@{healing}> HP"],
		["critical", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(fatiguingLifeDrainEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		healing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) }
	})
	.setModifiers({ name: "Impotence", stacks: 3 });

/** @type {typeof fatiguingLifeDrain.effect} */
function fatiguingLifeDrainEffect(targets, user, adventure) {
	const { essence, scalings: { damage, healing, critBonus }, modifiers: [impotence] } = lifeDrain;
	let pendingHealing = healing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, impotence)), gainHealth(user, pendingHealing, adventure));
}
//#endregion Fatiguing

//#region Furious
const furiousLifeDrain = new GearTemplate("Furious Life Drain",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and regain <@{healing}> HP"],
		["critical", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(furiousLifeDrainEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: {
			description: "Power x 1 to 1.5 based on your missing HP",
			calculate: (user) => {
				const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
				return user.getPower() * furiousness;
			}
		},
		critBonus: 2,
		healing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) }
	});

/** @type {typeof furiousLifeDrain.effect} */
function furiousLifeDrainEffect(targets, user, adventure) {
	const { essence, scalings: { damage, healing, critBonus } } = furiousLifeDrain;
	let pendingHealing = healing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(gainHealth(user, pendingHealing, adventure));
}
//#endregion Furious

//#region Reaper's
const reapersLifeDrain = new GearTemplate("Reaper's Life Drain",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and regain <@{healing}> HP, execute them if they end below half your damage cap"],
		["critical", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(reapersLifeDrainEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		healing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) }
	});

/** @type {typeof reapersLifeDrain.effect} */
function reapersLifeDrainEffect([target], user, adventure) {
	const { essence, scalings: { damage, healing, critBonus } } = reapersLifeDrain;
	let pendingHealing = healing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const { resultLines } = dealDamage([target], user, damage.calculate(user), false, essence, adventure);
	if (target.hp > (user.getDamageCap() / 2)) {
		target.hp = 0;
		const { extraLines } = downedCheck(target, adventure);
		return [`${target.name} meets the reaper!`].concat(extraLines, gainHealth(user, pendingHealing, adventure));
	} else {
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(gainHealth(user, pendingHealing, adventure));
	}
}
//#endregion Reaper's

//#region Thirsting
const thirstingLifeDrain = new GearTemplate("Thirsting Life Drain",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and regain <@{baseHealing} (+ @{thirstingHealing})> HP"],
		["critical", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(thirstingLifeDrainEffect, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		baseHealing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) },
		thirstingHealing: { description: "10% Max HP if foe is downed", calculate: (user) => Math.floor(user.getMaxHP() / 10) }
	});

/** @type {typeof thirstingLifeDrain.effect} */
function thirstingLifeDrainEffect(targets, user, adventure) {
	const { essence, scalings: { damage, baseHealing, critBonus, thirstingHealing } } = thirstingLifeDrain;
	let pendingHealing = baseHealing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		pendingHealing += thirstingHealing.calculate(user);
	}
	return resultLines.concat(gainHealth(user, pendingHealing, adventure));
}
//#endregion Thirsting

module.exports = new GearFamily(lifeDrain, [fatiguingLifeDrain, furiousLifeDrain, reapersLifeDrain, thirstingLifeDrain], true);
