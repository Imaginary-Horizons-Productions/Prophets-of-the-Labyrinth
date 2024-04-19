const { EnemyTemplate } = require("../classes");

module.exports = new EnemyTemplate("@{clone}",
	"@{clone}", // this shouldn't get used, clones always copy delvers
	300,
	100,
	"6",
	0,
	"clone", // this shouldn't get used, clones always copy delvers
	true
).setPower(35)
	.addAction({
		name: "Mirroring Moves",
		element: "Untyped",
		description: "Clones come with the same gear and will use the same move on a mirrored target as the delver they've copied."
	});
