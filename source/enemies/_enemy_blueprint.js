const { EnemyTemplate } = require("../classes");

module.exports = new EnemyTemplate("name",
	"essence",
	300,
	100,
	"3",
	0,
	"name",
	false
).addAction({
	name: "name",
	essence: "essence",
	description: "",
	priority: 0,
	effect: ([target], user, adventure) => {
		return "";
	},
	selector: (self, adventure) => { // check shared/actionComponents for reusable selctors and next functions
		return [];
	},
	next: "",
	combatFlavor: "(should mostly be omitted except for boss actions)"
});
