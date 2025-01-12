const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");

const { parseExpression } = require("../util/mathUtil");
const { listifyEN, getNumberEmoji } = require("../util/textUtil");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Treasure! Gold or Items?",
	"@{adventure}",
	"Two treasure boxes sit on opposite ends of a seesaw suspended above pits of molten rock. They are labled 'Gold' and 'Item Bundle' respectively, and it looks as if taking one will surely cause the other to plummet into the pit below.",
	function (adventure) {
		adventure.room.actions = 1;

		adventure.room.history = {
			"Treasure picked": []
		};
		const goldCount = Math.ceil(parseExpression("250*n", adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "always", goldCount);
		return [{ type: "Item", count: 2 + adventure.delvers.length, visibility: "always", forSale: false }];
	},
	function (roomEmbed, adventure) {
		if (adventure.room.actions > 0) {
			const options = [];
			for (const { name, type, count, visibility } of Object.values(adventure.room.resources)) {
				if (visibility === "always" && count > 0) {
					options.push({
						label: type === "Currency" ? `${getNumberEmoji(1)} ${count} ${name}` : `${getNumberEmoji(1)} ${name} x ${count}`,
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
