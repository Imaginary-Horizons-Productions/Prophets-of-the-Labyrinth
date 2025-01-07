const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

const gearName = "Midas's Bounty Fist";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict <@{damage} + gold paid> @{essence} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Pact",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, modifiers: [curseOfMidas] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const goldUsed = Math.floor(adventure.gold * (pactCost[0] / 100));
		adventure.gold -= goldUsed;
		let pendingDamage = damage + user.getPower() + goldUsed;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, curseOfMidas)), `${user.name}'s ${gearName} consumed ${goldUsed}g.`);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Thirsting Bounty Fist")
	.setPactCost([10, "@{pactCost}% of party gold"])
	.setDamage(40)
	.setModifiers({ name: "Curse of Midas", stacks: 2 });
