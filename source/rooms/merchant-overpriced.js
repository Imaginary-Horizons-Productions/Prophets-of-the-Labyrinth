const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");
const { getGearProperty } = require("../gear/_gearDictionary");
const { generateMerchantScoutingRow, generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

const uiGroups = [`gear${SAFE_DELIMITER}?`, `gear${SAFE_DELIMITER}Rare`];

module.exports = new RoomTemplate("Overpriced Merchant",
	"@{adventure}",
	"A masked figure sits in front of a packed rack of weapons and other gear. \"Best selction around! Looking for something particular?\"",
	[
		new ResourceTemplate("2*n+2", "always", "Gear").setTier("?").setCostExpression("1.5*n").setUIGroup(uiGroups[0]),
		new ResourceTemplate("4", "always", "Gear").setTier("Rare").setCostExpression("1.5*n").setUIGroup(uiGroups[1])
	],
	function (adventure) { },
	function (roomEmbed, adventure) {
		const mixedGearOptions = [];
		const rareGearOptions = [];

		Object.values(adventure.room.resources).forEach(({ name, uiGroup }, i) => {
			if (adventure.room.hasResource(name)) {
				if (uiGroups.includes(uiGroup)) {
					const cost = adventure.room.resources[name].cost;
					/** @type {number} */
					const maxCharges = getGearProperty(name, "maxCharges");
					const option = {
						label: `${cost}g: ${name}${maxCharges > 0 ? ` (${maxCharges}  charges)` : ""}`,
						description: "Gear",
						value: `${name}${SAFE_DELIMITER}${i}`
					};
					switch (uiGroup) {
						case uiGroups[0]: // mixed gear
							mixedGearOptions.push(option);
							break;
						case uiGroups[1]: // rare gear
							rareGearOptions.push(option);
							break;
					}
				}
			}
		});

		const hasMixedGearOptions = mixedGearOptions.length > 0;
		const hasRareGearOptions = rareGearOptions.length > 0;
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[0]}`)
						.setPlaceholder(hasMixedGearOptions ? "Check a piece of gear..." : "SOLD OUT")
						.setOptions(hasMixedGearOptions ? mixedGearOptions : EMPTY_SELECT_OPTION_SET)
						.setDisabled(!hasMixedGearOptions)
				),
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[1]}`)
						.setPlaceholder(hasRareGearOptions ? "Check a rare piece of gear..." : "SOLD OUT")
						.setOptions(hasRareGearOptions ? rareGearOptions : EMPTY_SELECT_OPTION_SET)
						.setDisabled(!hasRareGearOptions)
				),
				generateMerchantScoutingRow(adventure),
				generateRoutingRow(adventure)
			]
		};
	}
);
