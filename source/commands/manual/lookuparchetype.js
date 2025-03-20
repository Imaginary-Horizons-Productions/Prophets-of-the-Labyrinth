const { bold, MessageFlags } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { getEmoji, getColor } = require("../../util/essenceUtil");
const { listifyEN } = require("../../util/textUtil");
const { getAllArchetypeNames, getArchetype, getArchetypeActionName } = require("../../archetypes/_archetypeDictionary");
const { buildGearDescription } = require("../../gear/_gearDictionary");
const { getPlayer } = require("../../orcustrators/playerOrcustrator");
const { ICON_LOCKED } = require("../../constants");
const { SubcommandWrapper } = require("../../classes");

const ARCHETYPE_NAMES = getAllArchetypeNames();

module.exports = new SubcommandWrapper("archetype", "Look up an Archetype's essence, growth rates, starting gear, and specializations",
	async function executeSubcommand(interaction, ...args) {
		const archetypeName = interaction.options.getString("archetype-name");
		const nameInTitleCase = ARCHETYPE_NAMES.find(archetype => archetype.toLowerCase() === archetypeName.toLowerCase());
		if (!nameInTitleCase) {
			interaction.reply({ content: `Stats on ${bold(archetypeName)} could not be found. Check for typos!`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		const archetype = getArchetype(nameInTitleCase);
		const fields = [{ name: "Base Stats", value: `Max HP: ${archetype.maxHP}\nPower: 35\nSpeed: ${archetype.speed}\nCrit Rate: 20%`, inline: true }, { name: "Stat Growths", value: `Max HP: ${archetype.maxHPGrowth}\nPower: ${archetype.powerGrowth}\nSpeed: ${archetype.speedGrowth}\nCrit Rate: ${archetype.critRateGrowth}%`, inline: true }];
		fields.push(
			{ name: "Starting Gear", value: listifyEN(archetype.startingGear) },
			{ name: "Specializations and Archetype Actions", value: `Here are the ${nameInTitleCase} Archetype Actions and Specializations. Drafting ${nameInTitleCase} duplicates unlocks more Specializations (removes the ${ICON_LOCKED} icon).` }
		);
		const baseArchetypeActionName = getArchetypeActionName(nameInTitleCase, "base");
		const player = getPlayer(interaction.user.id, interaction.guildId);
		fields.push({ name: `${player.archetypes[nameInTitleCase]?.specializationsUnlocked > 0 ? "" : ICON_LOCKED}Base - ${baseArchetypeActionName}`, value: buildGearDescription(baseArchetypeActionName) });
		for (let i = 0; i < 4; i++) {
			const specialization = archetype.specializations[i];
			const archetypeActionName = getArchetypeActionName(nameInTitleCase, specialization);
			fields.push({ name: `${player.archetypes[nameInTitleCase]?.specializationsUnlocked > i ? "" : ICON_LOCKED}${specialization} - ${archetypeActionName}`, value: buildGearDescription(archetypeActionName) });
		}
		interaction.reply({
			embeds: [
				embedTemplate().setColor(getColor(archetype.essence))
					.setTitle(`${archetype.name} ${getEmoji(archetype.essence)}`)
					.setDescription(archetype.description)
					.addFields(fields)
			],
			flags: [MessageFlags.Ephemeral]
		});
	}
).setOptions(
	{
		type: "String",
		name: "archetype-name",
		description: "Input is case-insensitive",
		required: true,
		autocomplete: ARCHETYPE_NAMES.map(name => ({ name, value: name }))
	}
);
