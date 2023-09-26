const { CommandWrapper } = require('../classes');
const { itemExists, getItem, itemNames } = require('../items/_itemDictionary');
const { gearExists, getGearProperty, buildGearDescription, gearNames } = require('../gear/_gearDictionary');
const { getAllArtifactNames, getArtifact } = require('../artifacts/_artifactDictionary');
const { generateArtifactEmbed, embedTemplate } = require('../util/embedUtil');
const { getColor } = require('../util/elementUtil');

const mainId = "manual";
const options = [];
const subcommands = [
	{
		name: "gear-info",
		description: "Look up details on a piece of gear",
		optionsInput: [
			{
				type: "String",
				name: "gear-name",
				description: "Input is case-sensitive",
				required: true,
				autocomplete: gearNames.map(name => ({ name, value: name }))
			}
		]
	},
	{
		name: "item-info",
		description: "Look up details on an item",
		optionsInput: [
			{
				type: "String",
				name: "item-name",
				description: "Input is case-sensitive",
				required: true,
				autocomplete: itemNames.map(name => ({ name, value: name }))
			}
		]
	},
	{
		name: "artifact-info",
		description: "Look up details on an artifact",
		optionsInput: [
			{
				type: "String",
				name: "artifact-name",
				description: "Input is case-sensitive",
				required: true,
				autocomplete: getAllArtifactNames().map(name => ({ name, value: name }))
			}
		]
	}
];
module.exports = new CommandWrapper(mainId, "Get information about how to play or game entities", null, false, true, 3000, options, subcommands,
	(interaction) => {
		switch (interaction.options.getSubcommand()) {
			case subcommands[0].name: // gear-info
				const gearName = interaction.options.getString(subcommands[0].optionsInput[0].name);
				if (!gearExists(gearName)) {
					interaction.reply({ content: `Stats on **${gearName}** could not be found. Check for typos!`, ephemeral: true });
					return;
				}

				const fields = [
					{ name: "Max Durability", value: getGearProperty(gearName, "maxDurability").toString() },
					{ name: "Base Value", value: `${getGearProperty(gearName, "cost").toString()}g` }
				];

				const upgrades = getGearProperty(gearName, "upgrades");
				if (upgrades.length > 0) {
					fields.push({ name: "Upgrades Into", value: upgrades.join(", ") });
				}

				const sidegrades = getGearProperty(gearName, "sidegrades");
				if (sidegrades.length > 0) {
					fields.push({ name: "Can be Tinkered Into", value: sidegrades.join(", ") });
				}

				const extraField = getGearProperty(gearName, "flavorText");
				if (extraField) {
					fields.push(extraField);
				}

				interaction.reply({
					embeds: [
						embedTemplate().setColor(getColor(getEquipmentProperty(gearName, "element")))
							.setTitle(gearName)
							.setDescription(buildGearDescription(gearName, true))
							.addFields(fields)
					],
					ephemeral: true
				});
				break;
			case subcommands[1].name: // item-info
				// Returns a message containing the given consumable's game info
				const itemName = interaction.options.getString(subcommands[1].optionsInput[0].name);
				if (!itemExists(itemName)) {
					interaction.reply({ content: `Stats on **${itemName}** could not be found. Check for typos!`, ephemeral: true });
					return;
				}

				const { element, description, flavorText } = getItem(itemName);
				const embed = embedTemplate().setColor(getColor(element))
					.setTitle(itemName)
					.setDescription(description);
				// const adventure = getAdventure(interaction.channelId);
				// if (adventure) {
				// 	const numberHeld = adventure?.consumables[itemName] || 0;
				// 	embed.addFields({ name: "Number Held", value: numberHeld.toString() });
				// }
				if (flavorText) {
					embed.addFields(flavorText);
				}
				interaction.reply({ embeds: [embed], ephemeral: true });
				break;
			case subcommands[2].name: // artifact-info
				const artifactName = interaction.options.getString(subcommands[2].optionsInput[0].name);
				const artifactTemplate = getArtifact(artifactName);
				if (!artifactTemplate) {
					interaction.reply({ content: `Could not find an artifact named ${artifactName}.`, ephemeral: true });
					return;
				}

				interaction.reply({ embeds: [generateArtifactEmbed(artifactTemplate, 1, null)], ephemeral: true });
				break;
		}
	}
);
