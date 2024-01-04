const { SelectWrapper, Move, CombatantReference } = require('../classes');
const { SAFE_DELIMITER, EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { listifyEN } = require('../util/textUtil');

const mainId = "movetarget";
module.exports = new SelectWrapper(mainId, 3000,
	// Add move object to adventure
	async (interaction, [moveName, round, index]) => {
		const adventure = getAdventure(interaction.channelId);
		const user = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (moveName !== "Punch" && !(user?.gear.some(gear => gear.name === moveName && gear.durability > 0))) {
			// Needed to prevent crashes in case users keep ephemeral messages around and uses one with broken gear
			interaction.update({ content: `You don't have a ${moveName} with durability remaining.`, components: [], embeds: [] });
			return;
		} else {
			interaction.update(EMPTY_MESSAGE_PAYLOAD);
		}

		if (adventure?.room.round !== Number(round)) {
			return;
		}

		// Add move to round list (overwrite exisiting readied move)
		const userIndex = adventure.getCombatantIndex(user);
		const [targetTeam, unparsedIndex] = interaction.values[0].split(SAFE_DELIMITER);
		const targetIndex = parseInt(unparsedIndex);
		const targetIndices = [];
		const newMove = new Move(new CombatantReference(user.team, userIndex), "gear", user.crit)
			.setName(moveName)
			.setSpeedByCombatant(user)
			.setPriority(getGearProperty(moveName, "priority") ?? 0);

		const targetType = getGearProperty(moveName, "targetingTags").target;
		const crystalShardCount = adventure.getArtifactCount("Crystal Shard");
		if (targetType.startsWith("blast") || (crystalShardCount > 0 && getGearProperty(moveName, "category") === "Spell")) {
			const blastRange = parseInt(targetType.split(SAFE_DELIMITER)[1]) ?? 0;
			const range = crystalShardCount + blastRange;
			const targetTeamMaxIndex = targetTeam === "delver" ? adventure.delvers.length - 1 : adventure.room.enemies.length - 1;

			let targetsSelectedLeft = 0;
			let prebuffedMinIndex = targetIndex;
			for (let index = targetIndex - 1; targetsSelectedLeft < range && index >= 0; index--) {
				if (adventure.room.enemies[index].hp > 0) {
					targetsSelectedLeft++;
					targetIndices.unshift(index);
					if (targetsSelectedLeft <= blastRange) {
						prebuffedMinIndex = index;
					}
				}
			}

			targetIndices.push(targetIndex);

			let targetsSelectedRight = 0;
			let prebuffedMaxIndex = targetIndex;
			for (let index = targetIndex + 1; targetsSelectedRight < range && index <= targetTeamMaxIndex; index++) {
				if (adventure.room.enemies[index].hp > 0) {
					targetsSelectedRight++;
					targetIndices.push(index);
					if (targetsSelectedRight <= blastRange) {
						prebuffedMaxIndex = index;
					}
				}
			}

			targetIndices.forEach(index => {
				newMove.addTarget(new CombatantReference(targetTeam, index));
			});

			if (crystalShardCount > 0) {
				adventure.updateArtifactStat("Crystal Shard", "Extra Targets", (targetIndices[targetIndices.length - 1] - targetIndices[0]) - (prebuffedMaxIndex - prebuffedMinIndex));
			}
		} else {
			newMove.addTarget(new CombatantReference(targetTeam, targetIndex));
			targetIndices.push(targetIndex);
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
		const targets = targetIndices.map(index => `**${adventure.getCombatant({ team: targetTeam, index }).getName(adventure.room.enemyIdMap)}**`);
		interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${moveName}** to use on ${listifyEN(targets)}.`).then(() => {
			setAdventure(adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			}
		}).catch(console.error);
	}
);
