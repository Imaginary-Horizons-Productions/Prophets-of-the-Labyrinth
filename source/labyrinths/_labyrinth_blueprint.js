const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("name",
	"Untyped",
	10,
	[10],
	{
		Earth: [],
		Fire: [],
		Water: [],
		Wind: [],
		Untyped: []
	},
	{
		Earth: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Wind: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Water: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Fire: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Untyped: {
			Cursed: [],
			Common: [],
			Rare: []
		}
	},
	{
		"Event": [],
		"Battle": [],
		"Merchant": [],
		"Rest Site": [],
		"Final Battle": [],
		"Forge": [],
		"Artifact Guardian": [],
		"Treasure": [],
		"Empty": ["Empty Room"]
	}
);
