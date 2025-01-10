const { CommandInteraction, bold } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { getEmoji, getColor } = require("../../util/essenceUtil");
const { listifyEN } = require("../../util/textUtil");
const { getAllArchetypeNames, getArchetype, getArchetypeActionName } = require("../../archetypes/_archetypeDictionary");
const { buildGearDescription } = require("../../gear/_gearDictionary");
const { getPlayer } = require("../../orcustrators/playerOrcustrator");

const ARCHETYPE_NAMES = getAllArchetypeNames();

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	const archetypeName = interaction.options.getString("archetype-name");
	const nameInTitleCase = ARCHETYPE_NAMES.find(archetype => archetype.toLowerCase() === archetypeName.toLowerCase());
	if (!nameInTitleCase) {
		interaction.reply({ content: `Stats on ${bold(archetypeName)} could not be found. Check for typos!`, ephemeral: true });
		return;
	}

	const archetype = getArchetype(nameInTitleCase);
	const fields = [{ name: "Base Stats", value: `Max HP: ${archetype.maxHP}\nPower: 35\nSpeed: ${archetype.speed}\nCrit Rate: 20%`, inline: true }, { name: "Stat Growths", value: `Max HP: ${archetype.maxHPGrowth}\nPower: ${archetype.powerGrowth}\nSpeed: ${archetype.speedGrowth}\nCrit Rate: ${archetype.critRateGrowth}%`, inline: true }];
	fields.push(
		{ name: "Starting Gear", value: listifyEN(archetype.startingGear) },
		{ name: "Specializations and Archetype Actions", value: `Here are the ${nameInTitleCase} Archetype Actions and Specializations. Drafting ${nameInTitleCase} duplicates unlocks more Specializations (removes the 🔐 icon).` }
	);
	const baseArchetypeActionName = getArchetypeActionName(nameInTitleCase, "base");
	const player = getPlayer(interaction.user.id, interaction.guildId);
	fields.push({ name: `${player.archetypes[nameInTitleCase]?.specializationsUnlocked > 0 ? "" : "🔐"}Base - ${baseArchetypeActionName}`, value: buildGearDescription(baseArchetypeActionName) });
	for (let i = 0; i < 4; i++) {
		const specialization = archetype.specializations[i];
		const archetypeActionName = getArchetypeActionName(nameInTitleCase, specialization);
		fields.push({ name: `${player.archetypes[nameInTitleCase]?.specializationsUnlocked > i ? "" : "🔐"}${specialization} - ${archetypeActionName}`, value: buildGearDescription(archetypeActionName) });
	}
	console.log(fields);
	interaction.reply({
		embeds: [
			embedTemplate().setColor(getColor(archetype.essence))
				.setTitle(`${archetype.name} ${getEmoji(archetype.essence)}`)
				.setDescription(archetype.description)
				.addFields(fields)
		],
		ephemeral: true
	});
};

module.exports = {
	data: {
		name: "archetype",
		description: "Look up an Archetype's essence, growth rates, starting gear, and specializations",
		optionsInput: [
			{
				type: "String",
				name: "archetype-name",
				description: "Input is case-insensitive",
				required: true,
				autocomplete: ARCHETYPE_NAMES.map(name => ({ name, value: name }))
			}
		]
	},
	executeSubcommand
};
