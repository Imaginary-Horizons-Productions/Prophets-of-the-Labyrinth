const { EnemyTemplate } = require("../classes");

module.exports = new EnemyTemplate("@{clone}",
	"@{clone}",
	300,
	100,
	3,
	0,
	"clone", // this shouldn't get used, clones always copy delvers
	true
);
