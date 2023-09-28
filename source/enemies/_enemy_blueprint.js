const { EnemyTemplate } = require("../classes");

module.exports = new EnemyTemplate("name",
	"element",
	300,
	100,
	3,
	0,
	"name",
	false
).addAction({
	name: "name",
	element: "element",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		return "";
	},
	selector: (self, adventure) => { // check shared/actionComponents for reusable selctors and next functions
		return [];
	},
	next: (actionName) => {
		return "";
	}
});
