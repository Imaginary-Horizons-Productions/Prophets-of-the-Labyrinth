const { GearTemplate } = require("../classes");
const { addModifier, removeModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Organic Iron Fist Stance",
	"Increase Punch damage by @{bonus} and change its type to yours (exit other stances), regain 1 durability each room",
	"Inflict @{mod1Stacks} @{mod1} on all enemies",
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			adventure.room.enemies.forEach(enemy => {
				if (enemy.hp > 0) {
					addModifier(enemy, frail);
				}
			})
		}
		removeModifier(user, { name: "Floating Mist Stance", stacks: "all", force: true });
		addModifier(user, ironFistStance);
		return `${user.getName(adventure.room.enemyIdMap)} enters Iron Fist Stance${isCrit ? " and enemies become Frail" : ""}.`;
	}
).setTargetingTags({ target: "self", team: "any" })
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setDurability(10);
