const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "buyitem";
module.exports = new SelectWrapper(mainId, 3000,
	/** Allow the party to buy an item at a merchant */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
		const { count, cost } = adventure.room.resources[name];
		if (count < 1) {
			interaction.reply({ content: `There are no more ${name} for sale.`, ephemeral: true });
			return;
		}

		if (adventure.gold < cost) {
			interaction.reply({ content: "You don't have enough money to buy that.", ephemeral: true });
			return;
		}

		adventure.gold -= cost;
		adventure.room.resources[name].count--;
		adventure.gainItem(name, 1);
		interaction.message.edit(renderRoom(adventure, interaction.channel));
		interaction.reply({ content: `${interaction.member.displayName} buys a ${name} for ${cost}g.` });
		setAdventure(adventure);
	}
);
