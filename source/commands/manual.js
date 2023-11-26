const { CommandWrapper } = require('../classes');
const { itemExists, getItem, itemNames } = require('../items/_itemDictionary');
const { gearExists, getGearProperty, buildGearDescription, gearNames } = require('../gear/_gearDictionary');
const { getArtifact, artifactNames } = require('../artifacts/_artifactDictionary');
const { enemyNames, getEnemy } = require('../enemies/_enemyDictionary');
const { generateArtifactEmbed, embedTemplate } = require('../util/embedUtil');
const { getColor, getWeaknesses, getResistances, getEmoji, getOpposite, elementsList } = require('../util/elementUtil');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { listifyEN } = require('../util/textUtil');
const { modifiers } = require('../gear/warhammer-unstoppable');

const mainId = "manual";
const options = [];
const subcommands = [
	{
		name: "glossary",
		description: "Get info about individual topics",
		optionsInput: [
			{
				type: "String",
				name: "topic",
				description: "Your topic of interest",
				required: true,
				choices: [
					{ name: "Tutorial", value: "Tutorial" },
					{ name: "Elements", value: "Elements" },
					{ name: "Stagger", value: "Stagger" },
					{ name: "Damage Cap", value: "Damage Cap" }
				]
			},
		]
	},
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
				autocomplete: artifactNames.map(name => ({ name, value: name }))
			}
		]
	},
	{
		name: "enemy-info",
		description: "Look up details on an enemy",
		optionsInput: [
			{
				type: "String",
				name: "enemy-name",
				description: "Input is case-sensitive",
				required: true,
				autocomplete: enemyNames.map(name => ({ name, value: name }))
			}
		]
	}
];

const matchingElementStaggerField = { name: "Matching Element Stagger", value: "When a combatant makes a move that matches their element, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 2 additional Stagger. Check the page on Stagger to learn more about Stagger and Stun." };

module.exports = new CommandWrapper(mainId, "Get information about how to play or game entities", null, false, true, 3000, options, subcommands,
	(interaction) => {
		switch (interaction.options.getSubcommand()) {
			case subcommands[0].name: // topic
				switch (interaction.options.getString(subcommands[0].optionsInput[0].name)) {
					case "Tutorial":
						interaction.reply({
							embeds: [
								embedTemplate().setTitle("Prophets of the Labyrinth Tutorial")
									.setDescription("Prophets of the Labyrinth (or PotL) is a multiplayer roguelike dungeon crawl played directly on Discord. Each dungeon delve will start a new thread where players can discuss their strategies and votes.")
									.addFields([
										{ name: "Voting", value: "During an adventure, your team will explore deeper and deeper rooms of a labyrinth. After the events of each room, the party will vote on which room to explore next. The party must reach a consensus to continue (discussing your reasoning encouraged)." },
										{ name: "Combat", value: "If you encounter enemies (such as during the Final Battle in the last room), each player will be prompted to pick a move to do during the next turn. When everyone has selected their move, the game will report the results. Each character archetype starts with different gear and, importantly, predicts different information about the upcoming round. Make sure to share your relevant info with everyone!" },
										{ name: "Suggested Party Size", value: "Though the game has player count scaling, it is balanced primarily for groups of 3-6. Due to UI limitations, the max party size is 8. ***It is highly recommended that you play in a party.***" }
									])
							],
							ephemeral: true
						});
						break;
					case "Elements":
						const allElements = elementsList();
						interaction.reply({
							embeds: [
								embedTemplate().setTitle("Elements")
									.setDescription(`Each combatant is associated with one of the following elements: ${listifyEN(allElements.map(element => `${element} ${getEmoji(element)}`))}. Based on their element, damage they receive may be increased, decreased, or not changed depending on the element of the incoming damage.\n\nWhen a combatant receives damage they're weak to, damage is doubled. When a combatant receives damage they're resistant to, damage is halved. This change is calculated before block.`)
									.addFields(
										allElements.map(element => {
											const weaknesses = getWeaknesses(element);
											const resistances = getResistances(element);
											return { name: `${getEmoji(element)} ${element}`, value: `Opposite: ${getEmoji(getOpposite(element))}\nWeaknesses: ${weaknesses.length > 0 ? weaknesses.map(weakness => getEmoji(weakness)).join(" ") : "(none)"}\nResistances: ${resistances.length > 0 ? resistances.map(resistance => getEmoji(resistance)).join(" ") : "(none)"}` }
										}).concat(matchingElementStaggerField)
									)
							],
							ephemeral: true
						});
						break;
					case "Stagger":
						interaction.reply({
							embeds: [
								embedTemplate().setTitle("Stagger")
									.setDescription("Stagger stacks up on combatants when moves are used against them, leading to the combatant getting Stunned. Stagger promotes to Stun between rounds when a combatant's Stagger reaches their Poise (default 6 for delvers, varies for enemies). A stunned combatant misses their turn next round.")
									.addFields(matchingElementStaggerField)
							],
							ephemeral: true
						});
						break;
					case "Damage Cap":
						interaction.reply({
							embeds: [
								embedTemplate().setTitle("Damage Cap")
									.setDescription("The maximum amount of damage that can be done in one shot after block is 500. This cap is raised for each stack of Power Up a user has.")
							],
							ephemeral: true
						});
						break;
				}
				break;
			case subcommands[1].name: // gear-info
				const gearName = interaction.options.getString(subcommands[1].optionsInput[0].name);
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
					fields.push({ name: "Upgrades Into", value: listifyEN(upgrades) });
				}

				const sidegrades = getGearProperty(gearName, "sidegrades");
				if (sidegrades.length > 0) {
					fields.push({ name: "Can be Tinkered Into", value: listifyEN(sidegrades) });
				}

				const extraField = getGearProperty(gearName, "flavorText");
				if (extraField) {
					fields.push(extraField);
				}

				const gearElement = getGearProperty(gearName, "element");
				interaction.reply({
					embeds: [
						embedTemplate().setColor(getColor(gearElement))
							.setTitle(`${gearName} ${getEmoji(gearElement)}`)
							.setDescription(buildGearDescription(gearName, true))
							.addFields(fields)
					],
					ephemeral: true
				});
				break;
			case subcommands[2].name: // item-info
				const itemName = interaction.options.getString(subcommands[2].optionsInput[0].name);
				if (!itemExists(itemName)) {
					interaction.reply({ content: `Stats on **${itemName}** could not be found. Check for typos!`, ephemeral: true });
					return;
				}

				const { element, description, flavorText } = getItem(itemName);
				const embed = embedTemplate().setColor(getColor(element))
					.setTitle(itemName)
					.setDescription(description);
				const adventure = getAdventure(interaction.channelId);
				if (adventure) {
					const numberHeld = adventure?.items[itemName] || 0;
					embed.addFields({ name: "Number Held", value: numberHeld.toString() });
				}
				if (flavorText) {
					embed.addFields(flavorText);
				}
				interaction.reply({ embeds: [embed], ephemeral: true });
				break;
			case subcommands[3].name: // artifact-info
				const artifactName = interaction.options.getString(subcommands[3].optionsInput[0].name);
				const artifactTemplate = getArtifact(artifactName);
				if (!artifactTemplate) {
					interaction.reply({ content: `Could not find an artifact named ${artifactName}.`, ephemeral: true });
					return;
				}

				interaction.reply({ embeds: [generateArtifactEmbed(artifactTemplate, 1, null)], ephemeral: true });
				break;
			case "enemy-info":
				const enemyName = interaction.options.getString("enemy-name");
				const enemyTemplate = getEnemy(enemyName);
				if (!enemyTemplate) {
					interaction.reply({ content: `Could not find an enemy named ${enemyName}.`, ephemeral: true });
					return;
				}

				const enemyEmbed = embedTemplate().setTitle(`${enemyName} ${getEmoji(enemyTemplate.element)}`)
					.setDescription(`Base HP: ${enemyTemplate.maxHP}\nSpeed: ${enemyTemplate.speed}\nCrit Rate: ${enemyTemplate.critRate}%\nPoise: ${enemyTemplate.poiseExpression}`);
				const startingModifierEntries = Object.entries(enemyTemplate.startingModifiers);
				const enemyFields = [];
				if (startingModifierEntries.length > 0) {
					enemyFields.push({ name: "Starting Modifiers", value: listifyEN(startingModifierEntries.map(([name, stacks]) => `${stacks} ${name}`)) });
				}
				enemyFields.push({
					name: "Actions",
					value: Object.values(enemyTemplate.actions).map(action => `- **${action.name}** ${getEmoji(action.element)} ${action.description}`).join("\n")
				})
				if (enemyTemplate.flavorText) {
					enemyFields.push(enemyTemplate.flavorText);
				}
				enemyEmbed.addFields(enemyFields)
				interaction.reply({ embeds: [enemyEmbed], ephemeral: true });
				break;
		}
	}
);
