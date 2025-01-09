const { ItemTemplate } = require("../classes");
const { selectSelf } = require("../shared/actionComponents");
const { changeStagger } = require("../util/combatantUtil");

module.exports = new ItemTemplate("Flexigrass",
	"Relieve 4 Stagger on the user",
	"Unaligned",
	30,
	selectSelf,
	(targets, user, adventure) => {
		changeStagger([user], null, 4);
		return `${user.name} is relieved of some Stagger.`;
	}
);
