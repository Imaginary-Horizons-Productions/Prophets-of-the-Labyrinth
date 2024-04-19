const { SelectWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { gainHealth } = require('../util/combatantUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "applepiewishingwell";
module.exports = new SelectWrapper(mainId, 3000,
	/** Disable steal core, give item, regain hp */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const [tossedItem] = interaction.values;
		adventure.decrementItem(tossedItem, 1);
		adventure.room.history["Items tossed"].push(tossedItem);
		gainHealth(delver, delver.maxHP, adventure);
		interaction.update(renderRoom(adventure, interaction.channel));
		interaction.channel.send(`The ${tossedItem} becomes an apple pie. **${delver.name} is fully healed** by the delicious pie.`)
	}
);
