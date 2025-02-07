const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");
const { getGearProperty } = require("../gear/_gearDictionary");
const { getArtifact, rollArtifact } = require("../artifacts/_artifactDictionary");
const { getItem } = require("../items/_itemDictionary");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");

const uiGroups = [`gear${SAFE_DELIMITER}?`, "artifact", "item"];

module.exports = new RoomTemplate("Mysterious Merchant",
	"@{adventure}",
	"A masked figure sits in front of a a line up of flasks, vials, trinkets, and weapons. \"Care to trade?\"",
	function (adventure) {
		const labyrinthResourceOrders = [];
		for (let i = 0; i < 2 * adventure.delvers.length; i++) {
			labyrinthResourceOrders.push({ type: "Gear", count: 1, visibility: "always", forSale: true, uiGroup: uiGroups[0] });
		}
		for (let i = 0; i < adventure.delvers.length + 1; i++) {
			adventure.room.addResource(rollArtifact(adventure), "Artifact", "always", 1, uiGroups[1], 300);
			labyrinthResourceOrders.push({ type: "Item", count: 1, visibility: "always", forSale: true, uiGroup: uiGroups[2] });
		}
		adventure.room.history = {
			"Cap boosters": []
		};
		return labyrinthResourceOrders;
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
						let charges = getGearProperty(name, "maxCharges");
						const shoddyPenalty = adventure.getChallengeIntensity("Shoddy Spellcraft");
						const shoddyDuration = adventure.getChallengeDuration("Shoddy Spellcraft");
						if (shoddyPenalty > 0 && shoddyDuration > 0) {
							charges = Math.ceil(charges * (100 - shoddyPenalty) / 100);
						}
						if (![0, Infinity].includes(charges)) {
							gearOptions.push({
								label: `${cost}g: ${name}`,
								description: `${charges} Charges`,
								value: `${name}${SAFE_DELIMITER}${i}`
							});
						} else {
							gearOptions.push({
								label: `${cost}g: ${name}`,
								value: `${name}${SAFE_DELIMITER}${i}`
							});
						}
						break;
					}
					case uiGroups[1]: { // artifacts
						const artifact = getArtifact(name);
						artifactOptions.push({
							label: `${artifact.cost}g: ${name} (${adventure.room.resources[name].count} left)`,
							value: name
						})
						break;
					}
					case uiGroups[2]: { // items
						const item = getItem(name);
						itemOptions.push({
							label: `${item.cost}g: ${name} (${adventure.room.resources[name].count} left)`,
							value: `${name}${SAFE_DELIMITER}${i}`
						})
						break;
					}
				}
			}
		});

		const hasGearOptions = gearOptions.length > 0;
		const hasArtifactOptions = artifactOptions.length > 0;
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
						.setPlaceholder(hasArtifactOptions ? "Check an artifact..." : "SOLD OUT")
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
						.setLabel(`Increase Party Gear Capacity [${capUpCost}g]`)
						.setDisabled(adventure.gold < capUpCost)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
