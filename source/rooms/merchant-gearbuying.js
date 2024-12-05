const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");
const { getGearProperty } = require("../gear/_gearDictionary");
const { generateMerchantScoutingRow, generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Gear Buying Merchant",
	"@{adventure}",
	"A masked figure sits in front of a half-full rack of weapons and other gear. \"Care to trade?\"",
	[
		new ResourceTemplate("n+1", "always", "Gear").setTier("?")
	],
	function (adventure) { },
	function (roomEmbed, adventure) {
		const mixedGearOptions = [];

		Object.values(adventure.room.resources).forEach(({ name }, i) => {
			if (adventure.room.hasResource(name)) {
				const cost = adventure.room.resources[name].cost;
				/** @type {number} */
				const maxCharges = getGearProperty(name, "maxCharges");
				mixedGearOptions.push({
					label: `${cost}g: ${name}${maxCharges > 0 ? ` (${maxCharges}  charges)` : ""}`,
					description: "Gear",
					value: `${name}${SAFE_DELIMITER}${i}`
				});
			}
		});

		const hasMixedGearOptions = mixedGearOptions.length > 0;
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("buygear")
						.setPlaceholder(hasMixedGearOptions ? "Check a piece of gear..." : "SOLD OUT")
						.setOptions(hasMixedGearOptions ? mixedGearOptions : EMPTY_SELECT_OPTION_SET)
						.setDisabled(!hasMixedGearOptions)
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("sellgear")
						.setEmoji("💰")
						.setLabel("Sell Gear")
						.setStyle(ButtonStyle.Primary)
				),
				generateMerchantScoutingRow(adventure),
				generateRoutingRow(adventure)
			]
		};
	}
);
