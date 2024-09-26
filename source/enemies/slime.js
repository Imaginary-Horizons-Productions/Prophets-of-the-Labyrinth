const { EnemyTemplate } = require("../classes");
const { selectRandomFoe } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil.js");
const { joinAsStatement } = require("../util/textUtil.js");

module.exports = new EnemyTemplate("@{adventure} Slime",
	"@{adventure}",
	200,
	90,
	"n*2+4",
	0,
	"Tackle",
	false
).addAction({
	name: "Tackle",
	element: "@{adventure}",
	description: "Deal the Slime's element damage to a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 25;
		if (isCrit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, adventure.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Inflict @e{Slow} on a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		const slowedTargets = addModifier(targets, { name: "Slow", stacks: isCrit ? 3 : 2 });
		if (isCrit) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (slowedTargets.length > 0) {
			return [joinAsStatement(false, slowedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Slow")}.`)];
		} else {
			return [];
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
})
	.setFlavorText({ name: "Slime's Element", value: "The Slime's element will match the current adventure." });
