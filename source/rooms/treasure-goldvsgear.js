const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");

const { listifyEN } = require("../util/textUtil");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Treasure! Gold or Gear?",
	"@{adventure}",
	"Treasure",
	"Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Gold' and 'Gear' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.",
	[
		new ResourceTemplate("1", "internal", "roomAction"),
		new ResourceTemplate("250*n", "always", "Currency").setCostExpression("0"),
		new ResourceTemplate("2", "always", "Gear").setTier("?").setCostExpression("0")
	],
	function (adventure) {
		return {
			"Treasure picked": []
		};
	},
	function (roomEmbed, adventure) {
		if (adventure.room.hasResource("roomAction")) {
			const options = [];
			for (const { name, type, count, visibility } of Object.values(adventure.room.resources)) {
				if (visibility === "always" && count > 0) {
					options.push({
						label: type === "Currency" ? `${count} ${name}` : `${name} x ${count}`,
						description: type,
						value: `${name}${SAFE_DELIMITER}${options.length}`
					});
				}
			}
			const hasOptions = options.length > 0;
			return {
				embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId("treasure")
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
						new StringSelectMenuBuilder().setCustomId("treasure")
							.setPlaceholder(`Picked: ${listifyEN(adventure.room.history["Treasure picked"], false)}`)
							.setOptions(EMPTY_SELECT_OPTION_SET)
							.setDisabled(true)
					),
					generateRoutingRow(adventure)
				]
			};
		}
	}
);
