const { SelectWrapper } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArchetype } = require('../archetypes/_archetypeDictionary');

const mainId = "archetype";
module.exports = new SelectWrapper(mainId, 3000,
	/** Add the player's delver object to the adventure */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure?.state !== "config") {
			interaction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
			return;
		}

		// Add delver to list (or overwrite)
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const isSwitching = Boolean(delver.archetype);
		const archetype = interaction.values[0];
		delver.archetype = archetype;
		setAdventure(adventure);

		// Send confirmation text
		interaction.update(EMPTY_MESSAGE_PAYLOAD);
		interaction.channel.send(`**${interaction.user.displayName}** ${isSwitching ? "has switched to" : "will be playing as"} **${archetype}**. ${getArchetype(archetype).description}`);
	}
);
