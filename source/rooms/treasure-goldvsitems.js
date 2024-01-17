const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");

const { getItem } = require("../items/_itemDictionary");
const { trimForSelectOptionDescription, listifyEN } = require("../util/textUtil");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Treasure! Gold or Items?",
	"@{adventure}",
	"Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Gold' and 'Item Bundle' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.",
	[
		new ResourceTemplate("1", "internal", "roomAction"),
		new ResourceTemplate("250*n", "always", "gold").setCostExpression("0"),
		new ResourceTemplate("2", "always", "item").setCostExpression("0")
	],
	function (roomEmbed, adventure) {
		if (adventure.room.resources.roomAction.count > 0) {
			const options = [];
			for (const { name, type, count, visibility } of Object.values(adventure.room.resources)) {
				if (visibility === "always" && count > 0) {
					const option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

					if (name === "gold") {
						option.label = `${count} Gold`;
					} else {
						option.label = `${name} x ${count}`;
					}

					if (type === "item") {
						option.description = trimForSelectOptionDescription(getItem(name).description);
					}
					options.push(option)
				}
			}
			const hasOptions = options.length > 0;
			return {
				embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`treasure${SAFE_DELIMITER}treasure`)
							.setPlaceholder(hasOptions ? "Pick 1 treasure to take..." : "No treasure")
							.setOptions(hasOptions ? options : EMPTY_SELECT_OPTION_SET)
							.setDisabled(!hasOptions)
					),
					generateRoutingRow(adventure)
				]
			};
		} else {
			return {
				embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`treasure${SAFE_DELIMITER}treasure`)
							.setPlaceholder(`Picked: ${listifyEN(adventure.room.state.pickedTreasure.names)}`)
							.setOptions(EMPTY_SELECT_OPTION_SET)
							.setDisabled(true)
					),
					generateRoutingRow(adventure)
				]
			};
		}
	}
);
