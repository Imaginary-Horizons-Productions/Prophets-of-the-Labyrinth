const { ButtonWrapper } = require('../classes');
const { RN_TABLE_BASE } = require('../constants');
const { getAdventure, setAdventure, completeAdventure } = require('../orcustrators/adventureOrcustrator');
const { payHP } = require('../util/combatantUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "getgoldonfire";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Gold +50, HP -100 half the time*/
	(interaction, [burnDamage]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		burnDamage = parseInt(burnDamage);
		const goldCount = adventure.room.resources.gold.count;
		adventure.gainGold(goldCount);
		delete adventure.room.resources.gold;
		// deal damage on 50% chance
		if (adventure.generateRandomNumber(RN_TABLE_BASE, "general") > (RN_TABLE_BASE / 2)) {
			adventure.addResource(`Burned: ${interaction.member.displayName}`, "history", "internal", 1);
			payHP(delver, burnDamage, adventure);
			interaction.update(renderRoom(adventure, interaction.channel, `A large pile of gold sits quietly in the middle of the room, in a burning pillar of flame.`));
			if (adventure.lives < 1) {
				interaction.channel.send(completeAdventure(adventure, interaction.channel, "defeat", `${delver.name} was downed after burning themselves on gold (${burnDamage} damage). ***GAME OVER***`));
			}
		} else {
			interaction.update(renderRoom(adventure, interaction.channel));
		}
		setAdventure(adventure);
	}
);
