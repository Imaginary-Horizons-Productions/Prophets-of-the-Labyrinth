const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, downedCheck, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Toxic Flame Scythes",
	[
		["use", "Inflict @{damage} @{essence} damage and @{mod0Stacks} @{mod0} on a single foe, execute them if they end below half your damage cap"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, adventure) => {
		const { essence, damage, critMultiplier, modifiers: [poison] } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (target.hp > (user.getDamageCap() / 2)) {
			target.hp = 0;
			const { extraLines } = downedCheck(target, adventure);
			return [`${target.name} meets the reaper!`].concat(extraLines);
		} else {
			return resultLines.concat(generateModifierResultLines(addModifier([target], poison)));
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Thief's Flame Scythes", "Toxic Flame Scythes")
	.setCharges(15)
	.setDamage(40)
	.setModifiers({ name: "Poison", stacks: 3 });
