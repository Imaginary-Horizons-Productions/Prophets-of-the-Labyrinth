const { ButtonWrapper } = require('../classes');
const { prerollBoss } = require('../labyrinths/_labyrinthDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');
const { editButtons } = require('../util/messageComponentUtil');
const { ordinalSuffixEN } = require('../util/textUtil');

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
			adventure.scouting.finalBoss = true;
			adventure.updateArtifactStat("Amethyst Spyglass", "Gold Saved", 150 - cost);
			interaction.message.edit({ components: editButtons(interaction.message.components, { [interaction.customId]: { preventUse: true, label: `Final Battle: ${adventure.finalBoss}`, emoji: "✔️" } }) });
			interaction.reply(`The merchant reveals that final battle for this adventure will be **${adventure.finalBoss}** (you can review this with \`/party-stats\`).`);
		} else {
			adventure.updateArtifactStat("Amethyst Spyglass", "Gold Saved", 100 - cost);
			interaction.message.edit({ components: editButtons(interaction.message.components, { [interaction.customId]: { preventUse: adventure.gold < Number(cost), label: `${cost}g: Scout the ${ordinalSuffixEN(adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians + 2)} Artifact Guardian` } }) });
			interaction.reply(`The merchant reveals that the ${ordinalSuffixEN(adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians + 1)} artifact guardian for this adventure will be **${adventure.artifactGuardians[adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians]}** (you can review this with \`/adventure party-stats\`).`);
			adventure.scouting.artifactGuardians++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians) {
				prerollBoss("Artifact Guardian", adventure);
			}
		}
		updateRoomHeader(adventure, interaction.message);
		setAdventure(adventure);
	}
);
