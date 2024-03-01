const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("name",
	"Untyped",
	"description",
	10,
	[10],
	{
		Darkness: [],
		Earth: [],
		Fire: [],
		Light: [],
		Water: [],
		Wind: [],
		Untyped: []
	},
	{
		Darkness: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Earth: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Fire: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Light: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Water: {
			Cursed: [],
			Common: [],
			Rare: []
		},
		Wind: {
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
		"Workshop": [],
		"Artifact Guardian": [],
		"Treasure": [],
		"Empty": ["Empty Room"]
	}
);
