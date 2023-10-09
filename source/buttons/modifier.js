const { EmbedBuilder, Colors } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { modifiersToString } = require('../util/combatantUtil');
const { randomFooterTip } = require('../util/embedUtil');
const { isBuff, isDebuff, getModifierDescription, isNonStacking } = require('../modifiers/_modifierDictionary');

const mainId = "modifier";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Provide details about the given modifier */
	(interaction, [modifierName]) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure) {
			interaction.reply({ content: "This adventure is no longer active.", ephemeral: true });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (modifierName !== "MORE") {
			const buff = isBuff(modifierName);
			const debuff = isDebuff(modifierName);
			let styleColor;
			if (buff) {
				styleColor = Colors.Blurple;
			} else if (debuff) {
				styleColor = Colors.Red;
			} else {
				styleColor = Colors.LightGrey;
			}
			interaction.reply({
				embeds: [
					new EmbedBuilder().setColor(styleColor)
						.setTitle(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${delver.modifiers[modifierName]}`}`)
						.setDescription(getModifierDescription(modifierName, delver, adventure))
						.addFields({ name: "Category", value: `${buff ? "Buff" : debuff ? "Debuff" : "Modifier"}` })
						.setFooter(randomFooterTip())
				], ephemeral: true
			});
		} else {
			interaction.reply({
				embeds: [
					new EmbedBuilder().setColor(Colors.LightGrey)
						.setTitle("All Modifiers")
						.setDescription(modifiersToString(delver, true, adventure))
						.setFooter(randomFooterTip())
				],
				ephemeral: true
			});
		}
	}
);
