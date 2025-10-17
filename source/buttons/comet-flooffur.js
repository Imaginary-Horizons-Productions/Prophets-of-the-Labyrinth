const { MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { setAdventure, getAdventure } = require('../orcustrators/adventureOrcustrator');
const { gainHealth, receiptToResultLine } = require('../util/combatantUtil');
const { renderRoom } = require('../util/embedUtil');
const { RN_TABLE_BASE, ZERO_WIDTH_WHITESPACE } = require('../constants');

const mainId = "floofcometfur";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Restore 120 hp to the user (fixed so it's good early but meh later), with chance to fight. Does not take sword to be exclusive with Steal Sword option */
	(interaction, [wakePercent]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}
		if (adventure.room.history["Awoke Comet"].length > 0) {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
			return;
		}

		adventure.room.history["Floofed fur"].push(delver.name);
		interaction.update(renderRoom(adventure, interaction.channel)).then(() => {
			let msg = `How therapeutic, ${receiptToResultLine(gainHealth(delver, 120, adventure))}`;
			// base 40% chance fight
			if (adventure.generateRandomNumber(RN_TABLE_BASE, "general") < (RN_TABLE_BASE * (parseInt(wakePercent) / 100))) {
				adventure.room.history["Awoke Comet"].push(interaction.member.displayName);
				msg += " but Comet wakes!"
				interaction.message.edit(renderRoom(adventure, interaction.channel, `Comet has awoken! :anger::wolf:`));
			} else {
				msg += " Comet remains asleep..."
				interaction.message.edit(renderRoom(adventure, interaction.channel))
			}
			interaction.channel.send({ content: msg });

			setAdventure(adventure);
		});
	}
);
