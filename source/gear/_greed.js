const { GearTemplate } = require('../classes/index.js');
const { addModifier } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Greed",
	"Add @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to all Treasure Elementals with priority",
	"N/A",
	"Technique",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const { modifiers: [midas, powerUp] } = module.exports;
		const affectedTargets = [];
		targets.forEach(target => {
			if (target.archetype === "Treasure Elemental") {
				const addedCurse = addModifier(target, midas);
				const addedPowerUp = addModifier(target, powerUp);
				if (addedCurse && addedPowerUp) {
					affectedTargets.push(target.getName(adventure.room.enemyIdMap));
				}
			}
		})
		if (affectedTargets.length === 1) {
			return `${affectedTargets[0]} gains Curse of Midas and is Powered Up.`;
		} else {
			return `${listifyEN(affectedTargets)} gain Curse of Midas and are Powered Up.`;
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Power Up", stacks: 20 });
