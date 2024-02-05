const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Imp Contract Faire",
	"@{adventureWeakness}",
	"The next room contains several stalls with imps hawking suspicious contracts. One imp offers a lucrative opportunity (*given you allow your element to be changed to @{roomElement}). Another offers a sketcy procedure for improving party health.",
	[],
	function (adventure) { return {}; },
	function (roomEmbed, adventure) {
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("elementswap")
						.setLabel(`Change element [+200g, change to ${adventure.room.element}]`)
						.setStyle(ButtonStyle.Primary)
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("hpshare")
						.setLabel("Share HP [-50g, -100 hp, +100 hp for everyone else]")
						.setStyle(ButtonStyle.Primary)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
