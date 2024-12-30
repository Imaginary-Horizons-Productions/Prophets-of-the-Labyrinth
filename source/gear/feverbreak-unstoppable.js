const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines } = require('../util/combatantUtil');
const { unstoppablePassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Unstoppable Fever Break",
	[
		unstoppablePassive,
		["use", `Deal <pending damage from @{mod0} and @{mod1}> @{essence} damage to all foes, then cure them of those debuffs`],
		["Critical💥", "@{mod0} and @{mod1} are not removed"]
	],
	"Maneuver",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, moraleRequirement } = module.exports;
		if (adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let poisonDamage = 10;
		let frailDamage = 20;
		if (user.team === "delver") {
			const FUNNEL_BUFF = 2;
			const funnelCount = adventure.getArtifactCount("Spiral Funnel");
			poisonDamage += FUNNEL_BUFF * funnelCount;
			frailDamage += FUNNEL_BUFF * funnelCount;
		}
		const resultLines = [];
		const receipts = [];
		for (const target of targets) {
			const poisonStacks = target.getModifierStacks("Poison");
			const frailtyStacks = target.getModifierStacks("Frailty");
			const pendingDamage = poisonDamage * (poisonStacks ** 2 + poisonStacks) / 2 + frailDamage * frailtyStacks;
			resultLines.push(...dealDamage([target], user, pendingDamage, true, essence, adventure));
			if (!user.crit && target.hp > 0) {
				receipts.push(...removeModifier([target], { name: "Poison", stacks: "all" }).concat(removeModifier([target], { name: "Frailty", stacks: "all" })));
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "all", team: "foe" })
	.setSidegrades("Fatiguing Fever Break")
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frailty", stacks: 0 })
	.setMoraleRequirement(2);
