const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");

module.exports = new RoomTemplate("Health Redistribution",
	"Water",
	"An imp wearing glasses approaches you with a contract. It would allow you to heal your party members at the expense of the life of one of your own.",
	[]
).setBuildUI(
	function (adventure) {
		return [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("hpshare")
					.setLabel("Sign the contract [-50g, -50 hp, +50 hp for everyone else]")
					.setStyle(ButtonStyle.Primary)
			)
		];
	}
);
