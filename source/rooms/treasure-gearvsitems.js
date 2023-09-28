const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");

const { buildGearDescription } = require("../gear/_gearDictionary");
const { getItem } = require("../items/_itemDictionary");

module.exports = new RoomTemplate("Treasure! Gear or Items?",
	"@{adventure}",
	"Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Gear' and 'Item Bundle' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.",
	[
		new ResourceTemplate("1", "internal", "roomAction"),
		new ResourceTemplate("2", "always", "gear").setTier("?").setCostMultiplier(0),
		new ResourceTemplate("2", "always", "item").setCostMultiplier(0)
	]
).setBuildUI(function (adventure) {
	const options = [];
	for (const { name, resourceType, count, visibility } of Object.values(adventure.room.resources)) {
		if (visibility === "always" && count > 0) {
			const option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

			option.label = `${name} x ${count}`;
			switch (resourceType) {
				case "gear":
					option.description = buildGearDescription(name, false);
					break;
				case "item":
					option.description = getItem(name).description;
					break;
			}
			options.push(option)
		}
	}
	const hasOptions = options.length > 0;
	return new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder().setCustomId("treasure")
			.setPlaceholder(hasOptions ? "Pick 1 treasure to take..." : "No treasure")
			.setOptions(hasOptions ? options : [{ label: "If the menu is stuck, switch channels and come back.", description: "This usually happens when two players try to take the last thing at the same time.", value: "placeholder" }])
			.setDisabled(!hasOptions)
	)
});
