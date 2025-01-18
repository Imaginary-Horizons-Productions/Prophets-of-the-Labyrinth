const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Fatiguing Life Drain",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a single foe and regain <@{healing}> HP"],
		["Critical💥", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, healing, critBonus }, modifiers: [impotence] } = module.exports;
	let pendingHealing = healing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const resultLines = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, impotence)), gainHealth(user, pendingHealing, adventure));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		healing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) }
	})
	.setModifiers({ name: "Impotence", stacks: 3 });
