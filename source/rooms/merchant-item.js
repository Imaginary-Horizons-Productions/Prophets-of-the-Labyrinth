const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { getGearProperty, buildGearDescription } = require("../gear/_gearDictionary");
const { getItem } = require("../items/_itemDictionary");
const { generateMerchantScoutingRow } = require("../util/messageComponentUtil");

const uiGroups = [`gear${SAFE_DELIMITER}?`, "items"];

module.exports = new RoomTemplate("Item Merchant",
	"@{adventure}",
	"A masked figure sits in front of a a line up of flasks and vials. \"Care to trade?\"",
	[
		new ResourceTemplate("n", "always", "gear").setTier("?").setUIGroup(uiGroups[0]),
		new ResourceTemplate("n", "always", "item").setUIGroup(uiGroups[1])
	]
).setBuildUI(function (adventure) {
	const soldOutOptions = [{ label: "If the menu is stuck, switch channels and come back.", description: "This usually happens when two players try to buy the last item at the same time.", value: "placeholder" }];
	const gearOptions = [];
	const itemOptions = [];

	Object.values(adventure.room.resources).forEach(({ name, uiGroup }, i) => {
		if (adventure.room.resources[name].count > 0) {
			switch (uiGroup) {
				case uiGroups[0]: // gear
					const cost = adventure.room.resources[gearName].cost;
					const maxUses = getGearProperty(gearName, "maxUses");
					let description = buildGearDescription(gearName, false);
					if (description.length > 100) {
						description = description.slice(0, 99) + "…"; // Single character elipsis
					}
					gearOptions.push({
						label: `${cost}g: ${gearName} (${maxUses} uses)`,
						description,
						value: `${gearName}${SAFE_DELIMITER}${i}`
					});
					break;
				case uiGroups[1]: // items
					const item = getItem(itemName);
					itemOptions.push({
						label: `${item.cost}g: ${itemName}`,
						description: item.description,
						value: `${itemName}${SAFE_DELIMITER}${i}`
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
				.setOptions(hasGearOptions ? gearOptions : soldOutOptions)
				.setDisabled(!hasGearOptions)
		),
		new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[1]}`)
				.setPlaceholder(hasItemOptions ? "Check an item..." : "SOLD OUT")
				.setOptions(hasItemOptions ? itemOptions : soldOutOptions)
				.setDisabled(!hasItemOptions)
		),
		generateMerchantScoutingRow(adventure)
	];
});
