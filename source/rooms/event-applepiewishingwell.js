const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { EMPTY_SELECT_OPTION_SET } = require("../constants");

module.exports = new RoomTemplate("Apple Pie Wishing Well",
	"Light",
	"In the center of the room sits a wishing well with a glowing crystal core. Pinned to a post in front of the well are instructions indicating that tossing an item into the well will float it back as a delicious apple pie.",
	[],
	function (roomEmbed, adventure) {
		const itemSelectRow = new ActionRowBuilder();
		const partyItems = Object.entries(adventure.items);
		if (partyItems.length > 0) {
			itemSelectRow.addComponents(
				new StringSelectMenuBuilder().setCustomId("applepiewishingwell")
					.setPlaceholder("Select an item to toss...")
					.setOptions(partyItems.map(([itemName, count]) => ({ label: itemName, description: `Stock: ${count}`, value: itemName })))
			);
		} else {
			itemSelectRow.addComponents(
				new StringSelectMenuBuilder().setCustomId("applepiewishingwell")
					.setPlaceholder("No items to toss")
					.setOptions(EMPTY_SELECT_OPTION_SET)
					.setDisabled(true)
			);
		}
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				itemSelectRow,
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("stealwishingwellcore")
						.setLabel("Steal the core [+250g]")
						.setStyle(ButtonStyle.Primary)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
