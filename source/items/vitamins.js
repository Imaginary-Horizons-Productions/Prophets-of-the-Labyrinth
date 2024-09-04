const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { gainHealth } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Vitamins",
	"Increases the user's max HP by 50",
	"Untyped",
	30,
	selectSelf,
	false,
	(targets, user, isCrit, adventure) => {
		const gains = 50;
		user.maxHP += gains;
		gainHealth(user, gains, adventure);
		return "How healthy!";
	}
).setFlavorText({ name: "*Additional Notes*", value: "*Make sure to consume exactly the right number so your HP isn't divisible by 4*" });
