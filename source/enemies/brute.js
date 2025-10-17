const { EnemyTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { selectRandomFoe } = require("../shared/actionComponents");
const { addModifier, changeStagger, dealDamage, removeModifier } = require("../util/combatantUtil");
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
	description: `Deal ${getEmoji("Unaligned")} damage and moderate Stagger to The Target or, if there isn't one, mark a foe as The Target for a random number of attacks`,
	priority: 0,
	effect: ([target], user, adventure) => {
		const markedTarget = adventure.delvers.find(delver => "The Target" in delver.modifiers);
		if (!markedTarget) {
			// Mark or Mug rolls on [0, 3] then adds 2 for the number of 'The Target' stacks it applies
			return addModifier([target], { name: "The Target", stacks: user.roundRns[`Mug or Mark${SAFE_DELIMITER}Mug or Mark`][0] + 2 });
		} else {
			const results = dealDamage([markedTarget], user, 70, false, "Unaligned", adventure).results;
			results.push(...changeStagger([markedTarget], user, 3),
				...removeModifier([markedTarget], { name: "The Target", stacks: 1, force: true }));
			if (user.crit) {
				adventure.gold -= 5;
				results.push(`5g suddenly goes missing from the party's coffers.`);
			}
			return results;
		}
	},
	selector: selectRandomFoe,
	next: "Mug or Mark",
	rnConfig: {
		"Mug or Mark": 1
	}
}).setFlavorText({ name: "Resetting 'The Mark'", value: "Removing the 'The Mark' debuff will make the next Brute to act apply a new one. Each time a Brute attacks a stack will be removed, dying will remove all stacks (normal debuff curing works as well)." });
