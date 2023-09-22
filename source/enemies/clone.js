const { EnemyTemplate } = require("../classes/EnemyTemplate.js");

module.exports = new EnemyTemplate("@{clone}",
	"@{clone}",
	300,
	100,
	3,
	0,
	"clone", // this shouldn't get used, clones always copy delvers
	true
);
