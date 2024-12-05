const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");
const { getGearProperty } = require("../gear/_gearDictionary");
const { getItem } = require("../items/_itemDictionary");
const { generateMerchantScoutingRow, generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

const uiGroups = [`gear${SAFE_DELIMITER}?`, "item"];

module.exports = new RoomTemplate("Item Merchant",
	"@{adventure}",
	"A masked figure sits in front of a a line up of flasks and vials. \"Care to trade?\"",
	[
		new ResourceTemplate("n+1", "always", "Gear").setTier("?").setUIGroup(uiGroups[0]),
		new ResourceTemplate("n+1", "always", "Item").setUIGroup(uiGroups[1])
	],
	function (adventure) { },
	function (roomEmbed, adventure) {
		const gearOptions = [];
		const itemOptions = [];

		Object.values(adventure.room.resources).forEach(({ name, uiGroup }, i) => {
			if (adventure.room.hasResource(name)) {
				switch (uiGroup) {
					case uiGroups[0]: { // gear
						const cost = adventure.room.resources[name].cost;
						/** @type {number} */
						const maxCharges = getGearProperty(name, "maxCharges");
						gearOptions.push({
							label: `${cost}g: ${name}${maxCharges > 0 ? ` (${maxCharges}  charges)` : ""}`,
							description: "Gear",
							value: `${name}${SAFE_DELIMITER}${i}`
						});
						break;
					}
					case uiGroups[1]: { // items
						const item = getItem(name);
						itemOptions.push({
							label: `${item.cost}g: ${name}`,
							description: "Item",
							value: `${name}${SAFE_DELIMITER}${i}`
						})
						break;
					}
				}
			}
		});

		const hasGearOptions = gearOptions.length > 0;
		const hasItemOptions = itemOptions.length > 0;
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[0]}`)
						.setPlaceholder(hasGearOptions ? `Check a piece of gear...` : "SOLD OUT")
						.setOptions(hasGearOptions ? gearOptions : EMPTY_SELECT_OPTION_SET)
						.setDisabled(!hasGearOptions)
				),
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[1]}`)
						.setPlaceholder(hasItemOptions ? "Check an item..." : "SOLD OUT")
						.setOptions(hasItemOptions ? itemOptions : EMPTY_SELECT_OPTION_SET)
						.setDisabled(!hasItemOptions)
				),
				generateMerchantScoutingRow(adventure),
				generateRoutingRow(adventure)
			]
		};
	}
);
