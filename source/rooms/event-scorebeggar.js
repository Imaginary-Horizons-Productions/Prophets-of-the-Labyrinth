const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { SAFE_DELIMITER, ICON_LIFE, ICON_CONFIRM, ICON_CANCEL } = require("../constants");

module.exports = new RoomTemplate("The Score Beggar",
	"Water",
	"In the center of the room sits a desolate beggar.\n\"Score... more score... I need it! I'll give you this.\"\nThe beggar motions to a flask of questionable liquid.",
	function (adventure) {
		adventure.room.history = {
			"Traded for Flask": []
		};
		return [];
	},
	function (roomEmbed, adventure) {
		const tradeButtons = new ActionRowBuilder();
		if (adventure.room.history["Traded for Flask"].length < 1) {
			tradeButtons.addComponents(
				new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}score`)
					.setStyle(ButtonStyle.Success)
					.setEmoji(ICON_LIFE)
					.setLabel("Take the flask [-50 score: +1 life]")
			);
			if ("Placebo" in adventure.items) {
				tradeButtons.addComponents(
					new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}placebo`)
						.setStyle(ButtonStyle.Success)
						.setEmoji(ICON_LIFE)
						.setLabel("Trade a Placebo [-1 Placebo: +1 life]")
				)
			}
		} else {
			if (adventure.room.history["Traded for Flask"][0] === "score") {
				tradeButtons.addComponents(
					new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}score`)
						.setStyle(ButtonStyle.Success)
						.setEmoji(ICON_CONFIRM)
						.setLabel("Score traded")
						.setDisabled(true),
				);
				if ("Placebo" in adventure.items) {
					tradeButtons.addComponents(
						new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}placebo`)
							.setStyle(ButtonStyle.Success)
							.setEmoji(ICON_CANCEL)
							.setLabel("No flasks left")
							.setDisabled(true)
					)
				}
			} else {
				tradeButtons.addComponents(
					new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}score`)
						.setStyle(ButtonStyle.Success)
						.setEmoji(ICON_CANCEL)
						.setLabel("No flasks left")
						.setDisabled(true),
					new ButtonBuilder().setCustomId(`buylife${SAFE_DELIMITER}placebo`)
						.setStyle(ButtonStyle.Success)
						.setEmoji(ICON_CONFIRM)
						.setLabel("Placebo traded")
						.setDisabled(true)
				)
			}
		}
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [tradeButtons, generateRoutingRow(adventure)]
		};
	}
);
