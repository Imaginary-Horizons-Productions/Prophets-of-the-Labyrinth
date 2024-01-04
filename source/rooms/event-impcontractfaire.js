const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");

module.exports = new RoomTemplate("Imp Contract Faire",
	"@{adventureWeakness}",
	"The next room contains several stalls with imps hawking suspicious contracts. One imp offers a lucrative opportunity (*given you allow your element to be changed to @{roomElement}). Another offers a sketcy procedure for improving party health.",
	[]
).setBuildUI(
	function (adventure) {
		return [
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
			)
		];
	}
);
