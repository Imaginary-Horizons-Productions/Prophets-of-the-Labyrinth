const { EnemyTemplate } = require("../classes");
const { selectRandomFoe } = require("../shared/actionComponents");
const { generateModifierResultLines, addModifier, changeStagger, dealDamage } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new EnemyTemplate("Brute",
	"Unaligned",
	200,
	95,
	"5",
	0,
	"Mug or Mark",
	false
).addAction({
	name: "Mug or Mark",
	essence: "Unaligned",
	description: `Deal ${getEmoji("Unaligned")} damage and moderate Stagger to The Target, or mark a random delver as The Target if there isn't one`,
	priority: 0,
	effect: ([target], user, adventure) => {
		const markedTarget = adventure.delvers.find(delver => "The Target" in delver.modifiers);
		if (!markedTarget) {
			return generateModifierResultLines(addModifier([target], { name: "The Target", stacks: 1 }));
		} else {
			const resultLines = dealDamage([markedTarget], user, 70, false, "Unaligned", adventure);
			changeStagger([markedTarget], user, 3);
			resultLines.push(`${markedTarget.name} is Staggered.`);
			if (user.crit) {
				adventure.gold -= 5;
				resultLines.push(`5g suddenly goes missing from the party's coffers.`);
			}
			return resultLines;
		}
	},
	selector: selectRandomFoe,
	next: "Mug or Mark"
});
