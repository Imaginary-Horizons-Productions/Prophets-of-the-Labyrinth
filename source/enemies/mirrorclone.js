const { EnemyTemplate } = require("../classes");

module.exports = new EnemyTemplate("Mirror Clone",
	"@{custom}",
	300,
	100,
	"6",
	0,
	"Mirror Clone",
	true
).setPower(35)
	.addAction({
		name: "Mirroring Moves",
		essence: "Unaligned",
		description: "Clones come with the same gear and will use the same move on a mirrored target as the delver they've copied."
	});
