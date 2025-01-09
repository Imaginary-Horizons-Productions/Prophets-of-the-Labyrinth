const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addModifier, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Charging Tornado Formation",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe and grant all allies @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Maneuver",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, damage, modifiers: [swiftness, empowerment], critMultiplier } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, damage + user.getPower(), false, essence, adventure);
		const reciepts = [];
		const pendingSwiftness = { name: swiftness.name, stacks: swiftness.stacks.generator(user) };
		const userTeam = user.team === "delver" ? adventure.delvers : adventure.room.enemies.filter(enemy => enemy.hp > 0);
		if (user.crit) {
			pendingSwiftness.stacks *= critMultiplier;
		}
		reciepts.push(...addModifier(userTeam, pendingSwiftness).concat(addModifier(userTeam, empowerment)));
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Supportive Storm Formation")
	.setMoraleRequirement(1)
	.setDamage(40)
	.setModifiers({ name: "Swiftness", stacks: { description: "2 + Bonus Speed ÷ 10", generator: (user) => 2 + Math.floor(user.getBonusSpeed() / 10) } }, { name: "Empowerment", stacks: 25 });
