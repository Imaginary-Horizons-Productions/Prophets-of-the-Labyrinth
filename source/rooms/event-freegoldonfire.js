const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateRoutingRow } = require("../util/messageComponentUtil");
const { SAFE_DELIMITER } = require("../constants");

module.exports = new RoomTemplate("Free Gold?",
	"Fire",
	"A large pile of gold sits quietly in the middle of the room, seemingly alone.",
	[
		new ResourceTemplate("300", "internal", "gold")
	],
	function (roomEmbed, adventure) {
		let reward = 300;
		let burnDamage = 100;
		let getEmoji = "💰";
		let getLabel = `Leaving it would be a waste [+${reward}g]`;
		let isGetDisabled = false;
		const burnedDelver = Object.values(adventure.room.resources).find(resource => resource.name.startsWith("Burned: "))?.name.split(": ")[1];
		if (burnedDelver) {
			getEmoji = "🔥";
			getLabel = `+${reward}g, ${burnedDelver} -${burnDamage} HP`;
			isGetDisabled = true;
		} else if (!("gold" in adventure.room.resources)) {
			getEmoji = "✔️";
			getLabel = `+${reward}g`;
			isGetDisabled = true;
		}
		return {
			embeds: [roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." })],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`getgoldonfire${SAFE_DELIMITER}${burnDamage}`)
						.setStyle(ButtonStyle.Danger)
						.setEmoji(getEmoji)
						.setLabel(getLabel)
						.setDisabled(isGetDisabled)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
