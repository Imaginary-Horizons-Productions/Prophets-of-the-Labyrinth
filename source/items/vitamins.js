const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../util/actionComponents");
const { gainHealth } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Vitamins",
	"Increases the user's max HP by 50",
	"Untyped",
	30,
	selectSelf,
	(targets, user, isCrit, adventure) => {
		const gains = 50;
		user.maxHp += gains;
		gainHealth(user, gains, adventure);
		return "How healthy!";
	}
).setFlavorText(["*Additional Notes*", "*Make sure to consume exactly the right number so your HP isn't divisible by 4*"]);
