const { ButtonWrapper, CombatantReference, Move } = require('../classes');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "confirmmove";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Add move object to adventure */
	async (interaction, [moveName, round, index]) => {
		const adventure = getAdventure(interaction.channel.id);
		const user = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!(user?.gear.some(gear => gear.name === moveName && gear.durability > 0))) {
			interaction.update({ content: `You don't have a ${moveName} with remaining durability.`, embeds: [], components: [] })
				.catch(console.error);
			return;
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE, embeds: [], components: [] });
		}

		if (adventure?.room.round !== Number(round)) {
			return;
		}

		// Add move to round list (overwrite exisiting readied move)
		const userIndex = user.findMyIndex(adventure);
		const newMove = new Move(user, userIndex, "gear", user.crit)
			.setName(moveName)
			.setPriority(getGearProperty(moveName, "priority"));

		let targetText = "";
		const { target, team } = getGearProperty(moveName, "targetingTags");
		if (target === "all") {
			let targetCount = 0;
			if (team === "delver") {
				targetCount = adventure.delvers.length;
				targetText = "all allies";
			} else if (team === "enemy") {
				targetCount = adventure.room.enemies.length;
				targetText = "all enemies";
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(new CombatantReference(team, i));
			}
		} else if (target.startsWith("random")) {
			const targetCount = Number(target.split(SAFE_DELIMITER)[1]);
			let poolSize = 0;
			if (team === "delver") {
				poolSize = adventure.delvers.length;
				targetText = `${targetCount} random all${targetCount === 1 ? "y" : "ies"}`;
			} else if (team === "enemy") {
				poolSize = adventure.room.enemies.length;
				targetText = `${targetCount} random enem${targetCount === 1 ? "y" : "ies"}`;
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(new CombatantReference(team, adventure.generateRandomNumber(poolSize, "battle")));
			}
		} else if (target === "self") {
			newMove.addTarget(new CombatantReference(team, userIndex));
		} else if (target === "none") {
			newMove.addTarget(new CombatantReference("none", -1));
		}

		let overwritten = false;
		for (let i = 0; i < adventure.room.moves.length; i++) {
			const { userReference } = adventure.room.moves[i];
			if (userReference.team === user.team && userReference.index === userIndex) {
				await adventure.room.moves.splice(i, 1);
				overwritten = true;
				break;
			}
		}
		await adventure.room.moves.push(newMove);

		// Send confirmation text
		interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${moveName}**${target !== "none" && target !== "self" ? ` to use on **${targetText}**` : ""}.`).then(() => {
			setAdventure(adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			};
		}).catch(console.error);
	}
);