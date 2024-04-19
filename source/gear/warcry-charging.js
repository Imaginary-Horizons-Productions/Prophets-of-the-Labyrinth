const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Charging War Cry",
	"Inflict @{foeStagger} on a foe and all foes with Exposed then gain @{mod0Stacks} @{mod0}",
	"Stagger +@{bonus}",
	"Technique",
	"Fire",
	350,
	([initialTarget], user, isCrit, adventure) => {
		const targetSet = new Set();
		const targetArray = [];
		if (initialTarget.hp > 0) {
			targetSet.add(initialTarget.getName(adventure.room.enemyIdMap));
			targetArray.push(initialTarget);
		}
		adventure.room.enemies.forEach(enemy => {
			if (enemy.hp > 0 && enemy.getModifierStacks("Exposed") > 0 && !targetSet.has(enemy.getName(adventure.room.enemyIdMap))) {
				targetSet.add(enemy.getName(adventure.room.enemyIdMap));
				targetArray.push(enemy);
			}
		})

		const { element, modifiers: [powerup], stagger, bonus } = module.exports;
		let pendingStaggerStacks = stagger;
		if (user.element === element) {
			pendingStaggerStacks += 2;
		}
		if (isCrit) {
			pendingStaggerStacks += bonus;
		}
		changeStagger(targetArray, pendingStaggerStacks);
		let resultText = `${listifyEN([...targetSet], false)} ${targetArray.length === 1 ? "is" : "are"} Staggered by the fierce war cry.`;
		const addedPowerUp = addModifier([user], powerup).length > 0;
		if (addedPowerUp) {
			resultText += ` ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: false })
	.setSidegrades("Slowing War Cry", "Tormenting War Cry")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setStagger(2)
	.setBonus(2) // Stagger stacks
	.setDurability(15)
	.setPriority(1);
