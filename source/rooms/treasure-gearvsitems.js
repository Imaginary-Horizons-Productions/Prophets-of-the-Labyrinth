const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET, ICON_NEEDS_CONFIRMATION } = require("../constants");

const { listifyEN, getNumberEmoji } = require("../util/textUtil");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Treasure! Gear or Items?",
	"@{adventure}",
	"Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Gear' and 'Item Bundle' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.",
	function (adventure) {
		adventure.room.actions = 1;

		adventure.room.history = {
			"Treasure picked": []
		};
		return [{ type: "Item", count: 2 + adventure.delvers.length, visibility: "always", forSale: false }].concat(
			Array(2).fill(null).map(() => ({ type: "Gear", count: 1, visibility: "always", forSale: false }))
		);
	},
	function (roomEmbed, adventure) {
		if (adventure.room.actions > 0) {
			const options = [];
			for (const { name, type, count, visibility } of Object.values(adventure.room.resources)) {
				if (visibility === "always" && count > 0) {
					options.push({
						label: type === "Gear" ? `${ICON_NEEDS_CONFIRMATION} ${name}` : `${getNumberEmoji(1)} ${name} x ${count}`,
						description: type,
						value: `${name}${SAFE_DELIMITER}${options.length}`
					});
				}
			}
			const hasOptions = options.length > 0;
			return {
				embeds: [roomEmbed.addFields(pathVoteField)],
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
				embeds: [roomEmbed.addFields(pathVoteField)],
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
