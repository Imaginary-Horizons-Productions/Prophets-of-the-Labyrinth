const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Hastening Spear",
	[
		["use", "Deal <@{damage}> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critBonus}, increase party morale by @{morale}, reduce your cooldowns by @{cooldownReduction}"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, morale, cooldownReduction } } = module.exports;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!");
		user.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				gear.cooldown -= cooldownReduction;
			}
		})
		resultLines.push(`${user.name}'s cooldowns are hastened.`);
	}
	resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines;
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1,
		cooldownReduction: 1
	});
