const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");

const { getArtifact } = require("../artifacts/_artifactDictionary");
const { buildGearDescription } = require("../gear/_gearDictionary");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");
const { trimForSelectOptionDescription } = require("../util/textUtil");

module.exports = new RoomTemplate("Treasure! Artifact or Gear?",
	"@{adventure}",
	"Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Artifact' and 'Gear' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.",
	[
		new ResourceTemplate("1", "internal", "roomAction"),
		new ResourceTemplate("1", "always", "artifact").setCostExpression("0"),
		new ResourceTemplate("2", "always", "gear").setTier("?").setCostExpression("0")
	]
).setBuildUI(function (adventure) {
	if (adventure.room.resources.roomAction.count > 0) {
		const options = [];
		for (const { name, type, count, visibility } of Object.values(adventure.room.resources)) {
			if (visibility === "always" && count > 0) {
				const option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

				option.label = `${name} x ${count}`;
				switch (type) {
					case "gear":
						option.description = trimForSelectOptionDescription(buildGearDescription(name, false));
						break;
					case "artifact":
						option.description = trimForSelectOptionDescription(getArtifact(name).dynamicDescription(count));
						break;
				}
				options.push(option)
			}
		}
		const hasOptions = options.length > 0;
		return [new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`treasure${SAFE_DELIMITER}treasure`)
				.setPlaceholder(hasOptions ? "Pick 1 treasure to take..." : "No treasure")
				.setOptions(hasOptions ? options : EMPTY_SELECT_OPTION_SET)
				.setDisabled(!hasOptions)
		)];
	} else {
		return [new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`treasure${SAFE_DELIMITER}treasure`)
				.setPlaceholder(`Picked: ${adventure.room.state.pickedTreasure.names.join(", ")}`)
				.setOptions(EMPTY_SELECT_OPTION_SET)
				.setDisabled(true)
		)];
	}
});
