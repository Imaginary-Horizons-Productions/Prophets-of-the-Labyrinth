const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");
const { getGearProperty, buildGearDescription } = require("../gear/_gearDictionary");
const { getItem } = require("../items/_itemDictionary");
const { generateMerchantScoutingRow } = require("../util/messageComponentUtil");

const uiGroups = [`gear${SAFE_DELIMITER}?`, "item"];

module.exports = new RoomTemplate("Item Merchant",
	"@{adventure}",
	"A masked figure sits in front of a a line up of flasks and vials. \"Care to trade?\"",
	[
		new ResourceTemplate("n", "always", "gear").setTier("?").setUIGroup(uiGroups[0]),
		new ResourceTemplate("n", "always", "item").setUIGroup(uiGroups[1])
	]
).setBuildUI(function (adventure) {
	const gearOptions = [];
	const itemOptions = [];

	Object.values(adventure.room.resources).forEach(({ name, uiGroup }, i) => {
		if (adventure.room.resources[name].count > 0) {
			switch (uiGroup) {
				case uiGroups[0]: // gear
					const cost = adventure.room.resources[name].cost;
					/** @type {number} */
					const maxDurability = getGearProperty(name, "maxDurability");
					let description = buildGearDescription(name, false);
					if (description.length > 100) {
						description = description.slice(0, 99) + "…"; // Single character elipsis
					}
					gearOptions.push({
						label: `${cost}g: ${name} (${maxDurability} uses)`,
						description,
						value: `${name}${SAFE_DELIMITER}${i}`
					});
					break;
				case uiGroups[1]: // items
					const item = getItem(name);
					itemOptions.push({
						label: `${item.cost}g: ${name}`,
						description: item.description,
						value: `${name}${SAFE_DELIMITER}${i}`
					})
					break;
			}
		}
	});

	const hasGearOptions = gearOptions.length > 0;
	const hasItemOptions = itemOptions.length > 0;
	return [
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
		generateMerchantScoutingRow(adventure)
	];
});
