const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');
const { discountedPassive } = require('./shared/passiveDescriptions');

//#region Base
const musket = new GearTemplate("Musket",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Reset this gear's cooldown"]
	],
	"Adventuring",
	"Fire"
).setCost(200)
	.setEffect(musketEffect, { type: "single", team: "foe" })
	.setCooldown(3)
	.setScalings({ damage: damageScalingGenerator(120) });

/** @type {typeof musket.effect} */
function musketEffect(targets, user, adventure) {
	const { essence, scalings: { damage }, cooldown } = musket;
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (user.crit && user.gear) {
		const move = adventure.room.findCombatantMove({ team: user.team, index: adventure.getCombatantIndex(user) });
		const [_, gearIndex] = move.name.split(SAFE_DELIMITER);
		user.gear[gearIndex].cooldown = -1 * cooldown;
		resultLines.push(`${user.name} reloads their ${musket.name} immediately!`);
	}
	return resultLines;
}
//#endregion Base

//#region Discounted
const discountedMusket = new GearTemplate("Discounted Musket",
	[
		discountedPassive,
		["use", "Deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Reset this gear's cooldown"]
	],
	"Adventuring",
	"Fire"
).setCost(100)
	.setEffect(musketEffect, { type: "single", team: "foe" })
	.setCooldown(3)
	.setScalings({ damage: damageScalingGenerator(120) });
//#endregion Discounted

//#region Hunter's
const huntersMusket = new GearTemplate("Hunter's Musket",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, gain @{mod0Stacks} @{mod0} if they're downed"],
		["critical", "Reset this gear's cooldown"]
	],
	"Adventuring",
	"Fire"
).setCost(350)
	.setEffect(huntersMusketEffect, { type: "single", team: "foe" })
	.setCooldown(3)
	.setScalings({ damage: damageScalingGenerator(120) })
	.setModifiers({ name: "Empowerment", stacks: 25 });

/** @type {typeof huntersMusket.effect} */
function huntersMusketEffect(targets, user, adventure) {
	const { essence, scalings: { damage }, cooldown, modifiers: [empowerment] } = huntersMusket;
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		resultLines.push(...generateModifierResultLines(addModifier([user], empowerment)));
	}
	if (user.crit && user.gear) {
		const move = adventure.room.findCombatantMove({ team: user.team, index: adventure.getCombatantIndex(user) });
		const [_, gearIndex] = move.name.split(SAFE_DELIMITER);
		user.gear[gearIndex].cooldown = -1 * cooldown;
		resultLines.push(`${user.name} reloads their ${huntersMusket.name} immediately!`);
	}
	return resultLines;
}
//#endregion Hunter's
module.exports = new GearFamily(musket, [discountedMusket, huntersMusket], false);
