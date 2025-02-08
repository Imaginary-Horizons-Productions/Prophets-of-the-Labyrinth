const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, removeModifier, changeStagger, combineModifierReceipts, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Fatiguing Fever Break",
	[
		["use", `Inflict all foes with <pending damage from @{mod0} and @{mod1}> @{essence} damage and @{mod2Stacks} @{mod2}, then cure them of those debuffs`],
		["critical", "@{mod0} and @{mod1} are not removed"]
	],
	"Maneuver",
	"Darkness"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, modifiers } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
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
		const survivors = [];
		const receipts = [];
		for (const target of targets) {
			const poisonStacks = target.getModifierStacks("Poison");
			const frailtyStacks = target.getModifierStacks("Frailty");
			const pendingDamage = poisonDamage * (poisonStacks ** 2 + poisonStacks) / 2 + frailDamage * frailtyStacks;
			resultLines.push(...dealDamage([target], user, pendingDamage, false, essence, adventure).resultLines);
			if (target.hp > 0) {
				survivors.push(target);
				if (!user.crit) {
					receipts.push(...removeModifier([target], { name: "Poison", stacks: "all" }).concat(removeModifier([target], { name: "Frailty", stacks: "all" })));
				}
			}
		}
		receipts.push(...addModifier(survivors, modifiers[2]));
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}, { type: "all", team: "foe" })
	.setSidegrades("Unstoppable Fever Break")
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frailty", stacks: 0 }, { name: "Impotence", stacks: 2 })
	.setMoraleRequirement(2);
