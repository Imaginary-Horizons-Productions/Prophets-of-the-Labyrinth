const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { levelUp } = require("../util/delverUtil");

module.exports = new ItemTemplate("Vitamins",
	"Increases the user's level by 2",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		levelUp(user, 2, adventure);
		return [`${user.name} gains 2 levels!`];
	}
).setFlavorText({ name: "*Additional Notes*", value: "*Make sure to consume exactly the right number so your HP isn't divisible by 4*" });
