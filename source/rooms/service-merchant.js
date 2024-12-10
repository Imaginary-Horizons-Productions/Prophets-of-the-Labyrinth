const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate, ResourceTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");
const { getGearProperty } = require("../gear/_gearDictionary");
const { getArtifact } = require("../artifacts/_artifactDictionary");
const { getItem } = require("../items/_itemDictionary");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

const uiGroups = [`gear${SAFE_DELIMITER}?`, "artifact", "item"];

module.exports = new RoomTemplate("Mysterious Merchant",
	"@{adventure}",
	"A masked figure sits in front of a a line up of flasks, vials, trinkets, and weapons. \"Care to trade?\"",
	[
		new ResourceTemplate("2*n", "always", "Gear").setTier("?").setUIGroup(uiGroups[0]),
		new ResourceTemplate("n+1", "always", "Artifact").setUIGroup(uiGroups[1]),
		new ResourceTemplate("n+1", "always", "Item").setUIGroup(uiGroups[2])
	],
	function (adventure) {
		adventure.room.history = {
			"Cap boosters": []
		};
	},
	function (roomEmbed, adventure) {
		const gearOptions = [];
		const artifactOptions = [];
		const itemOptions = [];

		Object.values(adventure.room.resources).forEach(({ name, uiGroup }, i) => {
			if (adventure.room.hasResource(name)) {
				switch (uiGroup) {
					case uiGroups[0]: { // gear
						const cost = adventure.room.resources[name].cost;
						/** @type {number} */
						const maxCharges = getGearProperty(name, "maxCharges");
						gearOptions.push({
							label: `${cost}g: ${name}`,
							description: `Gear${![0, Infinity].includes(maxCharges) ? ` (${maxCharges} charges)` : ""}`,
							value: `${name}${SAFE_DELIMITER}${i}`
						});
						break;
					}
					case uiGroups[1]: { // artifacts
						const artifact = getArtifact(name);
						artifactOptions.push({
							label: "${artifact.cost}g: ${name}",
							description: "Artifact",
							value: name
						})
						break;
					}
					case uiGroups[2]: { // items
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
		const hasArtifactOptions = false && artifactOptions.length > 0;
		const hasItemOptions = itemOptions.length > 0;
		const capUpCost = 100;
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
						.setPlaceholder(hasArtifactOptions ? "Check an artifact (Coming Soon)..." : "Check an artifact (Coming Soon)...")
						.setOptions(hasArtifactOptions ? artifactOptions : EMPTY_SELECT_OPTION_SET)
						.setDisabled(!hasArtifactOptions)
				),
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`buy${uiGroups[2]}`)
						.setPlaceholder(hasItemOptions ? "Check an item..." : "SOLD OUT")
						.setOptions(hasItemOptions ? itemOptions : EMPTY_SELECT_OPTION_SET)
						.setDisabled(!hasItemOptions)
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`gearcapup${SAFE_DELIMITER}${capUpCost}`)
						.setStyle(ButtonStyle.Success)
						.setEmoji("🎒")
						.setLabel(`${capUpCost}g: Increase Party Gear Capacity`)
						.setDisabled(adventure.gold < capUpCost)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
