const { ButtonWrapper } = require('../classes');
const { prerollBoss } = require('../labyrinths/_labyrinthDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');
const { ordinalSuffixEN, commandMention } = require('../util/textUtil');

const mainId = "buyscouting";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Set flags for party scouting and remove gold from party inventory */
	(interaction, [type]) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const cost = adventure.calculateScoutingCost(type);
		adventure.gold -= cost;
		if (type === "Final Battle") {
			adventure.scouting.bosses++;
			adventure.updateArtifactStat("Amethyst Spyglass", "Gold Saved", 150 - cost);
			interaction.reply(`The merchant reveals that final battle for this adventure will be **${adventure.bosses[adventure.scouting.bossesEncountered]}** (you can review this with ${commandMention("adventure", "party-stats")}).`);
		} else {
			adventure.updateArtifactStat("Amethyst Spyglass", "Gold Saved", 100 - cost);
			interaction.reply(`The merchant reveals that the ${ordinalSuffixEN(adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians + 1)} artifact guardian for this adventure will be **${adventure.artifactGuardians[adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians]}** (you can review this with ${commandMention("adventure", "party-stats")}).`);
			adventure.scouting.artifactGuardians++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians) {
				prerollBoss("Artifact Guardian", adventure);
			}
		}
		interaction.message.edit(renderRoom(adventure, interaction.channel));
		setAdventure(adventure);
	}
);
