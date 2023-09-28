const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { buildGearDescription, getGearProperty } = require("../gear/_gearDictionary");
const { generateMerchantScoutingRow } = require("../util/messageComponentUtil");

const uiGroups = [`gear${SAFE_DELIMITER}?`, `gear${SAFE_DELIMITER}Rare`];

module.exports = new RoomTemplate("Gear Merchant",
	"@{adventure}",
	"A masked figure sits in front of a rack of weapons and other equipment. \"Care to trade?\"",
	[
		new ResourceTemplate("n", "always", "gear").setTier("?").setUIGroup(uiGroups[0]),
		new ResourceTemplate("1", "always", "gear").setTier("Rare").setUIGroup(uiGroups[1])
	]
).setBuildUI(function (adventure) {
	const soldOutOptions = [{ label: "If the menu is stuck, switch channels and come back.", description: "This usually happens when two players try to buy the last item at the same time.", value: "placeholder" }];
	const mixedGearOptions = [];
	const rareGearOptions = [];

	Object.values(adventure.room.resources).forEach(({ name, uiGroup }, i) => {
		if (adventure.room.resources[name].count > 0) {
			if (uiGroups.includes(uiGroup)) {
				const cost = adventure.room.resources[name].cost;
				const maxUses = getGearProperty(name, "maxUses");
				let description = buildGearDescription(name, false);
				if (description.length > 100) {
					description = description.slice(0, 99) + "…"; // Single character elipsis
				}
				const option = {
					label: `${cost}g: ${name} (${maxUses} uses)`,
					description,
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
	return [
		new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[0]}`)
				.setPlaceholder(hasMixedGearOptions ? "Check a piece of gear..." : "SOLD OUT")
				.setOptions(hasMixedGearOptions ? mixedGearOptions : soldOutOptions)
				.setDisabled(!hasMixedGearOptions)
		),
		new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[1]}`)
				.setPlaceholder(hasRareGearOptions ? "Check a rare piece of gear..." : "SOLD OUT")
				.setOptions(hasRareGearOptions ? rareGearOptions : soldOutOptions)
				.setDisabled(!hasRareGearOptions)
		),
		generateMerchantScoutingRow(adventure)
	];
});
