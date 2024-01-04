const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Midas Staff",
	"Apply @{mod0Stacks} @{mod0} to a combatant, then gain @{mod1Stacks} @{mod1}",
	"@{mod0} +@{bonus}",
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [curse, quicken], bonus } = module.exports;
		const pendingCurse = { ...curse };
		if (isCrit) {
			pendingCurse.stacks += bonus;
		}
		if (user.element === element) {
			if (target.team === user.team) {
				target.addStagger("elementMatchAlly");
			} else {
				target.addStagger("elementMatchFoe");
			}
		}
		const addedCurse = addModifier(target, pendingCurse);
		const addedQuicken = addModifier(user, quicken);
		const targetName = target.getName(adventure.room.enemyIdMap);
		const userName = user.getName(adventure.room.enemyIdMap);
		if (targetName === userName) {
			if (addedCurse) {
				return `${userName} gains Curse of Midas${addedQuicken ? " and is Quickened" : ""}.`;
			} else if (addedQuicken) {
				return `${userName} is Quickened.`;
			} else {
				return "But nothing happened.";
			}
		} else {
			if (addedCurse) {
				return `${targetName} gains Curse of Midas. ${addedQuicken ? ` ${userName} is Quickened.` : ""}`;
			} else if (addedQuicken) {
				return `${userName} is Quickened.`;
			} else {
				return "But nothing happened.";
			}
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Discounted Midas Staff", "Soothing Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
