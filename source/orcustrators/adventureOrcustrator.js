const fs = require("fs");
const { ThreadChannel, Message } = require("discord.js");

const { Adventure, CombatantReference, Move, Enemy, Delver, Room, Combatant } = require("../classes");

const { SAFE_DELIMITER, MAX_SELECT_OPTIONS, MAX_MESSAGE_ACTION_ROWS, RN_TABLE_BASE } = require("../constants.js");

const { getCompany, setCompany } = require("./companyOrcustrator");

const { rollArtifact } = require("../artifacts/_artifactDictionary");
const { rollChallenges, getChallenge } = require("../challenges/_challengeDictionary");
const { getEnemy } = require("../enemies/_enemyDictionary");
const { getGearProperty } = require("../gear/_gearDictionary");
const { getItem } = require("../items/_itemDictionary");
const { rollGear, rollItem, getLabyrinthProperty, prerollBoss, rollRoom } = require("../labyrinths/_labyrinthDictionary");
const { getTurnDecrement } = require("../modifiers/_modifierDictionary");

const { removeModifier, addModifier, dealModifierDamage, gainHealth, changeStagger, addProtection, getNames } = require("../util/combatantUtil");
const { getWeaknesses, getEmoji, getOpposite } = require("../util/elementUtil");
const { renderRoom, updateRoomHeader, generateRecruitEmbed } = require("../util/embedUtil");
const { ensuredPathSave } = require("../util/fileUtil");
const { clearComponents } = require("../util/messageComponentUtil");
const { spawnEnemy } = require("../util/roomUtil");
const { parseExpression, listifyEN } = require("../util/textUtil");
const { sumGeometricSeries } = require("../util/mathUtil");
const { levelUp } = require("../util/delverUtil.js");

/** @type {Map<string, Adventure>} */
const adventureDictionary = new Map();

async function loadAdventures() {
	const dirPath = "./saves";
	const fileName = "adventures.json";
	const filePath = `${dirPath}/${fileName}`;
	const requirePath = "../../saves/adventures.json";

	if (fs.existsSync(filePath)) {
		const adventures = require(requirePath);
		let loaded = 0;
		adventures.forEach(adventure => {
			if (!Adventure.endStates.includes(adventure.state)) {
				loaded++;
				// Cast delvers into Delver class
				const castDelvers = [];
				for (let delver of adventure.delvers) {
					castDelvers.push(Object.assign(new Delver(), delver));
				}
				adventure.delvers = castDelvers;

				if (adventure.room) {
					adventure.room = Object.assign(new Room(), adventure.room);

					// Cast enemies into Enemy class
					if (adventure.room.enemies) {
						const castEnemies = [];
						for (let enemy of adventure.room.enemies) {
							castEnemies.push(Object.assign(new Enemy(), enemy));
						}
						adventure.room.enemies = castEnemies;
					}

					// Cast moves into Move class
					if (adventure.room.moves) {
						let castMoves = [];
						for (let move of adventure.room.moves) {
							castMoves.push(Object.assign(new Move(), move));
						}
						adventure.room.moves = castMoves;
					}
				}

				// Set adventure
				adventureDictionary.set(adventure.id, Object.assign(new Adventure(adventure.initialSeed, adventure.guildId), adventure));
			}
		})
		return `${loaded} adventures loaded`;
	} else {
		ensuredPathSave(dirPath, fileName, "[]");
		return "adventures regenerated";
	}
}

/** @param {string} id the Discord snowflake of the adventure's thread */
function getAdventure(id) {
	return adventureDictionary.get(id);
}

/** @param {Adventure} adventure */
function setAdventure(adventure) {
	adventureDictionary.set(adventure.id, adventure);
	ensuredPathSave("./saves", "adventures.json", JSON.stringify(Array.from(adventureDictionary.values())));
}

/** @type {Record<number, string[]>} key = weight, value = roomTag[] */
const roomTypesByRarity = {
	1: ["Treasure"],
	5: ["Workshop", "Rest Site", "Merchant", "Artifact Guardian"],
	13: ["Battle", "Event"]
};

/** @param {Adventure} adventure */
function rollGearTier(adventure) {
	const cloverCount = adventure.getArtifactCount("Negative-One Leaf Clover");
	const baseUpgradeChance = 1 / 8;
	const max = RN_TABLE_BASE ** 2;
	const threshold = max * sumGeometricSeries(baseUpgradeChance, 1 - baseUpgradeChance, 1 + cloverCount);
	adventure.updateArtifactStat("Negative-One Leaf Clover", "Expected Extra Rare Gear", (threshold / max) - baseUpgradeChance);
	const roll = adventure.generateRandomNumber(max, "general");
	if (roll >= 7 / 8 * max) {
		return "Cursed";
	} else if (roll < threshold) {
		return "Rare";
	} else {
		return "Common";
	}
}

/** Set up the upcoming room: roll options for rooms after, update adventure's room meta data object for current room, and generate room's resources
 * @param {"Artifact Guardian" | "Treasure" | "Workshop" | "Rest Site" | "Merchant" | "Battle" | "Event" | "Empty"} roomType
 * @param {ThreadChannel} thread
 */
function nextRoom(roomType, thread) {
	const adventure = getAdventure(thread.id);

	adventure.delvers.forEach(delver => {
		delver.protection = 0;
		if (adventure.challenges["Training Weights"]?.duration > 0) {
			const stacks = adventure.challenges["Training Weights"].intensity;
			delver.modifiers = {
				"Slow": stacks,
				"Exposed": stacks
			};
		} else {
			delver.modifiers = {};
		}
		delver.stagger = 0;
		delver.isStunned = false;
		delver.gear.forEach(gear => {
			if (gear.name.startsWith("Organic")) {
				const maxDurability = getGearProperty(gear.name, "maxDurability");
				if (gear.durability < maxDurability) {
					gear.durability++;
				}
			}
		})
	})

	const piggyBankCount = adventure.getArtifactCount("Piggy Bank");
	const interest = Math.floor(adventure.gold * piggyBankCount * 0.05);
	if (piggyBankCount > 0) {
		adventure.gainGold(interest);
		adventure.updateArtifactStat("Piggy Bank", "Interest Accrued", interest);
	}

	// Roll options for next room type
	if (!getLabyrinthProperty(adventure.labyrinth, "bossRoomDepths").includes(adventure.depth + 1)) {
		const mapCount = adventure.getArtifactCount("Enchanted Map");
		if (mapCount) {
			adventure.updateArtifactStat("Enchanted Map", "Extra Rooms Rolled", mapCount);
		}
		const numCandidates = 2 + mapCount;
		const max = RN_TABLE_BASE ** 2;
		const rushingChance = adventure.getChallengeIntensity("Rushing") / 100;
		const roomWeights = Object.keys(roomTypesByRarity);
		const totalWeight = roomWeights.reduce((total, weight) => total + parseInt(weight), 0);
		for (let i = 0; i < numCandidates; i++) {
			let rn = adventure.generateRandomNumber(totalWeight, 'general');
			let tagPool = [];
			for (const weight of roomWeights.sort((a, b) => a - b)) {
				if (rn < weight) {
					tagPool = roomTypesByRarity[weight];
					break;
				} else {
					rn -= weight;
				}
			}
			const candidateTag = `${tagPool[adventure.generateRandomNumber(tagPool.length, "general")]}${SAFE_DELIMITER}${adventure.depth}`;
			if (!(candidateTag in adventure.roomCandidates)) {
				adventure.roomCandidates[candidateTag] = { voterIds: [], isHidden: adventure.generateRandomNumber(max, "general") < max * rushingChance };
				if (Object.keys(adventure.roomCandidates).length === MAX_MESSAGE_ACTION_ROWS) {
					break;
				}
			}
		}
	} else {
		adventure.roomCandidates[`Final Battle${SAFE_DELIMITER}${adventure.depth}`] = { voterIds: [], isHidden: false };
	}

	// Generate current room
	const roomTemplate = rollRoom(roomType, adventure);
	adventure.room = new Room(roomTemplate.title, roomTemplate.element, roomTemplate.buildHistory(adventure), roomTemplate.enemyList);
	if (adventure.room.element === "@{adventure}") {
		adventure.room.element = adventure.element;
	} else if (adventure.room.element === "@{adventureWeakness}") {
		const weaknessPool = getWeaknesses(adventure.element);
		adventure.room.element = weaknessPool[adventure.generateRandomNumber(weaknessPool.length, "general")];
	}

	// Initialize Resources
	for (const { type: resourceType, count: unparsedCount, tier: unparsedTier, visibility, costExpression: unparsedCostExpression, uiGroup } of roomTemplate.resourceList) {
		const count = Math.ceil(parseExpression(unparsedCount, adventure.delvers.length));
		switch (resourceType) {
			case "challenge":
				rollChallenges(Math.min(MAX_SELECT_OPTIONS, count), adventure).forEach(challengeName => {
					adventure.room.addResource(challengeName, resourceType, visibility, 1);
				})
				break;
			case "gear":
				let tier = unparsedTier;
				for (let i = 0; i < Math.min(MAX_SELECT_OPTIONS, count); i++) {
					if (unparsedTier === "?") {
						tier = rollGearTier(adventure);
					}
					const gearName = rollGear(tier, adventure);
					adventure.room.addResource(gearName, resourceType, visibility, 1, uiGroup, Math.ceil(parseExpression(unparsedCostExpression ?? "0", getGearProperty(gearName, "cost", resourceType))));
				}
				break;
			case "artifact":
				const artifact = rollArtifact(adventure);
				adventure.room.addResource(artifact, resourceType, visibility, count, uiGroup);
				break;
			case "item":
				const item = rollItem(adventure);
				adventure.room.addResource(item, resourceType, visibility, count, uiGroup, Math.ceil(parseExpression(unparsedCostExpression, getItem(item).cost)));
				break;
			case "gold":
				// Randomize loot gold
				let goldCount = count;
				if (visibility !== "internal") {
					goldCount = Math.ceil(count * (90 + adventure.generateRandomNumber(21, "general")) / 100);
				}
				adventure.room.addResource(resourceType, resourceType, visibility, goldCount, uiGroup);
				break;
			default:
				let resourceCount = count;
				const hammerCount = adventure.getArtifactCount("Best-in-Class Hammer");
				if (roomTemplate.primaryCategory === "Workshop" && resourceType === "roomAction" && hammerCount > 0) {
					resourceCount += hammerCount;
					adventure.updateArtifactStat("Best-in-Class Hammer", "Extra Room Actions", hammerCount);
				}
				adventure.room.addResource(resourceType, resourceType, visibility, resourceCount, uiGroup);
		}
	}

	if (Object.keys(roomTemplate.enemyList).length > 0) {
		if (roomType === "Artifact Guardian") {
			adventure.scouting.artifactGuardiansEncountered++;
			while (adventure.artifactGuardians.length <= adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians) {
				prerollBoss("Artifact Guardian", adventure);
			}
			adventure.scouting.artifactGuardians = Math.max(adventure.scouting.artifactGuardians - 1, 0);
		}
		if (roomType === "Final Battle") {
			adventure.scouting.bossesEncountered++;
			while (adventure.bosses.length <= adventure.scouting.bossesEncountered + adventure.scouting.bosses) {
				prerollBoss("Final Battle", adventure);
			}
			adventure.scouting.bosses = Math.max(adventure.scouting.bosses - 1, 0);
		}

		for (const enemyName in roomTemplate.enemyList) {
			for (let i = 0; i < Math.ceil(parseExpression(roomTemplate.enemyList[enemyName], adventure.delvers.length)); i++) {
				spawnEnemy(getEnemy(enemyName), adventure);
			}
		}
		newRound(adventure, thread);
		setAdventure(adventure);
	} else {
		thread.send(renderRoom(adventure, thread)).then(message => {
			adventure.messageIds.room = message.id;
			setAdventure(adventure);
		});
	}
}

/**
 * @param {"Artifact Guardian" | "Treasure" | "Workshop" | "Rest Site" | "Merchant" | "Battle" | "Event" | "Empty"} roomType
 * @param {ThreadChannel} thread
 */
function endRoom(roomType, thread) {
	const adventure = getAdventure(thread.id);
	adventure.depth++;
	adventure.room = {};
	// reset roomCandidates early enough (before being deferred to the callback stack) to prevent routevote racecondition
	adventure.roomCandidates = {};

	for (const challengeName in adventure.challenges) {
		if (adventure.challenges[challengeName].duration) {
			adventure.challenges[challengeName].duration--;
			if (adventure.challenges[challengeName].duration < 1) {
				getChallenge(challengeName).complete(adventure, thread);
			}
		}
	}
	nextRoom(roomType, thread);
}

/** Cleans up previous combat round, generates events for current round, and sends room message
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} lastRoundText
 */
function newRound(adventure, thread, lastRoundText) {
	// Increment round and clear last round's components
	adventure.room.round++;

	// Logistics for Next Round
	const teams = {
		enemy: adventure.room.enemies,
		delver: adventure.delvers
	};
	for (const teamName in teams) {
		teams[teamName].forEach(
			/**
			 * @param {Combatant} combatant
			 * @param {number} i
			 */
			(combatant, i) => {
				if (combatant.team === "delver") {
					const boatPartsCount = adventure.getArtifactCount("Boat Parts");
					if (boatPartsCount > 0 && adventure.room.round <= boatPartsCount + 1) {
						const boatProtection = boatPartsCount * 25 + 25;
						addProtection([combatant], boatProtection);
						adventure.updateArtifactStat("Boat Parts", "Protection Generated", boatProtection);
					}

					const peacockCharmCount = adventure.getArtifactCount("Peacock Charm");
					if (peacockCharmCount > 0) {
						const peacockProtection = peacockCharmCount + combatant.poise - combatant.stagger;
						addProtection([combatant], peacockProtection);
						adventure.updateArtifactStat("Peacock Charm", "Protection Generated", peacockProtection);
					}
				}

				// Roll Round Speed
				const percentBonus = (adventure.generateRandomNumber(21, "battle") - 10) / 100;
				combatant.roundSpeed = Math.floor(combatant.speed * percentBonus);
				removeModifier([combatant], { name: "Slow", stacks: 1, force: true });
				removeModifier([combatant], { name: "Quicken", stacks: 1, force: true });

				// Roll Critical Hit
				const baseCritChance = combatant.getCritRate() / 100;
				const max = RN_TABLE_BASE ** 2;
				let threshold;
				const luckyStacks = combatant.getModifierStacks("Lucky") - combatant.getModifierStacks("Unlucky");
				if (combatant.team === "delver") {
					const featherCount = adventure.getArtifactCount("Hawk Tailfeather");
					if (featherCount > 0) {
						threshold = calculateCritThreshold(max, baseCritChance, luckyStacks + featherCount);
						adventure.updateArtifactStat("Hawk Tailfeather", "Expected Extra Critical Hits", (threshold / max) - baseCritChance);
					}
				}
				if (threshold === undefined) {
					threshold = calculateCritThreshold(max, baseCritChance, luckyStacks);
				}
				const critRoll = adventure.generateRandomNumber(max, "battle");
				combatant.crit = critRoll < threshold;

				// Roll Enemy Moves
				if (teamName === "enemy") {
					if (combatant.archetype !== "@{clone}") {
						const enemyTemplate = getEnemy(combatant.archetype);
						let actionName = combatant.nextAction;
						if (actionName === "random") {
							const actionPool = Object.keys(enemyTemplate.actions);
							actionName = actionPool[adventure.generateRandomNumber(actionPool.length, "battle")];
						}
						if (actionName === "a random protocol") {
							const actionPool = Object.keys(enemyTemplate.actions).filter(actionName => actionName.includes("Protocol"));
							actionName = actionPool[adventure.generateRandomNumber(actionPool.length, "battle")];
						}
						const move = new Move(new CombatantReference(combatant.team, i), "action", combatant.crit)
							.setName(actionName)
							.setSpeedByCombatant(combatant)
							.setPriority(enemyTemplate.actions[actionName].priority);
						enemyTemplate.actions[actionName].selector(combatant, adventure).forEach(({ team, index }) => {
							move.addTarget(new CombatantReference(team, index));
						});
						adventure.room.moves.push(move);
						combatant.nextAction = enemyTemplate.actions[actionName].next;
					} else {
						adventure.room.moves.push(
							new Move(new CombatantReference(combatant.team, i), "action", combatant.crit)
								.setName("@{clone}")
								.setSpeedByCombatant(combatant)
						);
					}
				}

				// Persisting Round Effects
				const floatingMistStacks = combatant.getModifierStacks("Floating Mist Stance");
				if (floatingMistStacks > 0) {
					addModifier([combatant], { name: "Evade", stacks: floatingMistStacks * 2 });
				}
			})
	}

	/**
	 * @param {number} thresholdMax
	 * @param {number} baseCritChance
	 * @param {number} critBoosts
	 */
	function calculateCritThreshold(thresholdMax, baseCritChance, critBoosts) {
		const virtualRolls = 1 + Math.abs(critBoosts);
		if (luckyStacks > -1) {
			return thresholdMax * sumGeometricSeries(baseCritChance, 1 - baseCritChance, virtualRolls);
		} else {
			// Design note: Extra factor of 2 because exponential nature scales Unlucky too fast
			return 2 * thresholdMax * (sumGeometricSeries(baseCritChance, 1 - baseCritChance, virtualRolls) ** virtualRolls);
		}
	}

	thread.send(renderRoom(adventure, thread, lastRoundText)).then(message => {
		if (!checkNextRound(adventure)) {
			updateRoomHeader(adventure, message);
			adventure.messageIds.battleRound = message.id;
		} else {
			clearComponents(message.id, thread.messages);
			endRound(adventure, thread);
		}
		setAdventure(adventure);
	});
}

/** Updates game state with the move's effect AND returns the game's description of what happened
 * @param {Move} move
 * @param {Adventure} adventure
 * @returns {Promise<string>} result text
 */
function resolveMove(move, adventure) {
	const user = adventure.getCombatant(move.userReference);
	if (!user || user.hp < 1) {
		return "";
	}

	let moveText = `**${getNames([user], adventure)[0]}** `;
	if (!user.isStunned || move.name.startsWith("Unstoppable")) {
		if (move.isCrit) {
			moveText = `💥${moveText}`;
		}

		let effect;
		let needsLivingTargets = false;
		switch (move.type) {
			case "action":
				if (move.userReference.team !== "delver") {
					const action = getEnemy(user.archetype).actions[move.name];
					let parsedElement = action.element;
					if (parsedElement === "@{adventure}") {
						parsedElement = adventure.element;
					} else if (parsedElement === "@{adventureOpposite}") {
						parsedElement = getOpposite(adventure.element);
					}
					effect = action.effect;
					needsLivingTargets = action.needsLivingTargets;
					moveText = `${getEmoji(parsedElement)} ${moveText}`;
				}
				break;
			case "gear":
				effect = getGearProperty(move.name, "effect");
				needsLivingTargets = getGearProperty(move.name, "targetingTags").needsLivingTargets;
				moveText = `${getEmoji(getGearProperty(move.name, "element"))} ${moveText}`;
				if (move.userReference.team === "delver" && adventure.getArtifactCount("Crystal Shard") > 0 && getGearProperty(move.name, "category") === "Spell") {
					adventure.updateArtifactStat("Crystal Shard", "Spells Cast", 1);
				}
				break;
			case "item":
				let isPlacebo = false;
				if (move.userReference.team === "delver") {
					const placeboDillution = adventure.getChallengeIntensity("Unlabelled Placebos");
					if (placeboDillution > 0) {
						isPlacebo = (placeboDillution - 1) === adventure.generateRandomNumber(placeboDillution, "battle");
					}
				}
				const { effect: itemEffect, element, needsLivingTargets: needsLivingTargetsInput } = getItem(isPlacebo ? "Placebo" : move.name);
				effect = itemEffect;
				if (move.userReference.team !== "enemy") {
					adventure.decrementItem(move.name, 1);
				}
				needsLivingTargets = needsLivingTargetsInput;
				moveText = `${getEmoji(element)} ${moveText}`;
				break;
		}

		moveText += `used ${move.name}`;
		if (needsLivingTargets) {
			const targets = move.targets.map(targetReference => adventure.getCombatant(targetReference));
			const livingTargets = [];
			const deadTargets = [];
			for (const target of targets) {
				if (target.hp > 0) {
					livingTargets.push(target);
				} else {
					deadTargets.push(target);
				}
			}
			if (livingTargets.length > 0) {
				let deadTargetText = "";
				if (deadTargets.length > 0) {
					deadTargetText += ` ${listifyEN(getNames(deadTargets, adventure), false)} ${deadTargets.length === 1 ? "was" : "were"} already dead!`
				}

				const resultText = effect(livingTargets, adventure.getCombatant(move.userReference), move.isCrit, adventure);
				moveText += `. ${resultText}${deadTargetText}${move.type === "gear" && move.userReference.team === "delver" ? decrementDurability(move.name, user, adventure) : ""}`;
			} else if (targets.length === 1) {
				moveText += `, but ${getNames([targets[0]], adventure)[0]} was already dead!`;
			} else {
				moveText += `, but all targets were already dead!`;
			}
		} else {
			const targets = move.targets.map(targetReference => adventure.getCombatant(targetReference)).filter(reference => !!reference);
			const resultText = effect(targets, adventure.getCombatant(move.userReference), move.isCrit, adventure);
			moveText += `. ${resultText}${move.type === "gear" && move.userReference.team === "delver" ? decrementDurability(move.name, user, adventure) : ""}`;
		}

		const insigniaCount = adventure.getArtifactCount("Celestial Knight Insignia");
		if (insigniaCount > 0 && user.team === "delver" && move.isCrit) {
			const insigniaHealing = insigniaCount * 15;
			moveText += ` ${gainHealth(user, insigniaHealing, adventure)}`;
			adventure.updateArtifactStat("Health Restored", insigniaHealing);
		}
	} else {
		moveText = `💫 ${moveText} is Stunned!`;
	}

	// Poison/Regen
	if ("Poison" in user.modifiers) {
		moveText += ` ${dealModifierDamage(user, "Poison", adventure)}`;
	} else {
		const regenStacks = user.getModifierStacks("Regen");
		if (regenStacks) {
			moveText += ` ${gainHealth(user, regenStacks * 10, adventure)}`;
		}
	}
	return `${moveText}\n`;
}

/**
 * @param {string} moveName
 * @param {Combatant} user
 * @param {Adventure} adventure
 */
function decrementDurability(moveName, user, adventure) {
	if (!["Punch", "Appease", "Greed"].includes(moveName) && user.team === "delver") {
		const gearCategory = getGearProperty(moveName, "category");
		if (gearCategory === "Weapon") {
			const weaponPolishCount = adventure.getArtifactCount("Weapon Polish");
			if (weaponPolishCount > 0) {
				const durabilitySaveChance = 1 - 0.85 ** weaponPolishCount;
				const max = RN_TABLE_BASE ** 2;
				adventure.updateArtifactStat("Weapon Polish", "Expected Durability Saved", durabilitySaveChance.toFixed(2));
				if (adventure.generateRandomNumber(max, "battle") < max * durabilitySaveChance) {
					adventure.updateArtifactStat("Weapon Polish", "Actual Durability Saved", 1);
					return "";
				}
			}
		}

		const gear = user.gear.find(gear => gear.name === moveName);
		gear.durability--;
		if (gear.durability < 1) {
			return ` The ${moveName} broke!`;
		}
	}
	return "";
}

/** Generate reactive moves, randomize speed ties, then resolve moves
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 */
function endRound(adventure, thread) {
	clearComponents(adventure.messageIds.battleRound, thread.messages);

	const randomOrderBag = Array(adventure.room.moves.length).fill().map((_, idx) => idx) // ensure that unique values are available for each move
	for (const move of adventure.room.moves) {
		// Randomize speed ties
		const rIdx = adventure.generateRandomNumber(randomOrderBag.length, "battle");
		move.randomOrder = randomOrderBag.splice(rIdx, 1)[0]; // pull a remaining randomOrder out of the bag and assign it to a move

		// Generate Reactive Moves by Enemies
		const user = adventure.getCombatant(move.userReference);
		if (user.archetype === "@{clone}") {
			const counterpartMove = adventure.room.moves.find(searchedMove => searchedMove.userReference.team === "delver" && searchedMove.userReference.index === move.userReference.index);
			move.type = counterpartMove.type;
			move.setName(counterpartMove.name);
			move.setPriority(counterpartMove.priority);
			move.targets = counterpartMove.targets.map(target => {
				return { team: target.team === "enemy" ? "delver" : "enemy", index: target.index };
			})
		}
	}

	adventure.room.moves.sort(Move.compareMoveSpeed)

	// Resolve moves
	let lastRoundText = "";
	for (const move of adventure.room.moves) {
		lastRoundText += resolveMove(move, adventure);

		const { payload, type } = checkEndCombat(adventure, thread, lastRoundText);
		if (payload) {
			thread.send(payload).then(message => {
				if (type === "endCombat") {
					adventure.messageIds.battleRound = message.id;
				}
			})
			return;
		}
	}
	adventure.room.moves = [];

	/** @type {Combatant[]} */
	const combatants = adventure.delvers.concat(adventure.room.enemies);
	for (const combatant of combatants) {
		if (combatant.isStunned) {
			combatant.isStunned = false;
			combatant.stagger = 0;
		} else if (combatant.stagger >= combatant.getPoise()) {
			combatant.isStunned = true;

			if ("Progress" in combatant.modifiers) {
				combatant.modifiers.Progress = Math.ceil(combatant.getModifierStacks("Progress") * 0.8);
			}

			if ("Frail" in combatant.modifiers) {
				lastRoundText += dealModifierDamage(combatant, "Frail", adventure);
				removeModifier([combatant], { name: "Frail", stacks: "all" });

				const { payload, type } = checkEndCombat(adventure, thread, lastRoundText);
				if (payload) {
					thread.send(payload).then(message => {
						if (type === "endCombat") {
							adventure.messageIds.battleRound = message.id;
						}
					})
					return;
				}
			}
		} else {
			changeStagger([combatant], combatant.getModifierStacks("Paralysis") > 0 ? 1 : -1);
		}

		// Decrement Modifiers
		if (!("Vigilance" in combatant.modifiers)) {
			removeModifier([combatant], { name: "Evade", stacks: getTurnDecrement("Evade"), force: true });
		}
		for (const modifier in combatant.modifiers) {
			if (modifier !== "Evade") {
				removeModifier([combatant], { name: modifier, stacks: getTurnDecrement(modifier), force: true })
			}
		}
	}

	newRound(adventure, thread, lastRoundText);
}

/**
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} lastRoundText
 */
function checkEndCombat(adventure, thread, lastRoundText) {
	if (adventure.lives <= 0) {
		adventure.room.round++;
		return { payload: completeAdventure(adventure, thread, "defeat", lastRoundText), type: "adventureDefeat" };
	}

	if (adventure.room.enemies.every(enemy => enemy.hp === 0)) {
		if ("endedCombat" in adventure.room.history) {
			return { type: "endCombat" };
		}
		adventure.room.history.endedCombat = [];

		if (adventure.depth >= getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
			return { payload: completeAdventure(adventure, thread, "success", lastRoundText), type: "adventureSuccess" };
		}

		const baseLevelsGained = adventure.room.resources.levelsGained.count ?? 0;
		delete adventure.room.resources.levelsGained;
		adventure.room.history.baseLevels = [baseLevelsGained];
		for (const delver of adventure.delvers) {
			const manualManuallevels = adventure.getArtifactCount("Manual Manual");
			if (manualManuallevels > 0) {
				adventure.updateArtifactStat("Manual Manual", "Bonus Levels", manualManuallevels);
			}
			const gearLevelBonus = delver.gear.reduce((bonusLevels, currentGear) => {
				if (currentGear.name.startsWith("Wise")) {
					return bonusLevels + 1;
				} else {
					return bonusLevels;
				}
			}, 0);
			const levelsGained = baseLevelsGained + manualManuallevels + gearLevelBonus;
			const historyKey = `levelsGained:${levelsGained}`;
			if (historyKey in adventure.room.history) {
				adventure.room.history[historyKey].push(delver.name);
			} else {
				adventure.room.history[historyKey] = [delver.name];
			}
			levelUp(delver, levelsGained, adventure);
		}

		// Gear drops
		const gearThreshold = 1;
		const gearMax = 16;
		if (adventure.generateRandomNumber(gearMax, "general") < gearThreshold) {
			const tier = rollGearTier(adventure);
			const droppedGear = rollGear(tier, adventure);
			adventure.room.addResource(droppedGear, "gear", "loot", 1);
		}

		// Item drops
		const itemThreshold = 1;
		const itemMax = 8;
		if (adventure.generateRandomNumber(itemMax, "general") < itemThreshold) {
			adventure.room.addResource(rollItem(adventure), "item", "loot", 1);
		}

		return { payload: renderRoom(adventure, thread, lastRoundText), type: "endCombat" };
	}
	return { type: "continueCombat" };
}

/** The round ends when all combatants have readied all their moves
 * @param {Adventure} adventure
 */
function checkNextRound({ room, delvers }) {
	const readiedMoves = room.moves.length;
	const movesThisRound = room.enemies.length + delvers.length;
	return readiedMoves === movesThisRound;
}

/** The recruit message solicits new delvers to join (until the adventure starts) and shows the state of the adventure publically thereafter
 * @param {ThreadChannel} thread the adventure's thread
 * @param {string} messageId usually stored in `adventure.messageIds.recruit`
 * @returns {Promise<Message>}
 */
async function fetchRecruitMessage(thread, messageId) {
	const channel = await thread.guild.channels.fetch(thread.parentId);
	return channel.messages.fetch(messageId);
}

/**
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {"success" | "defeat" | "giveup"} endState
 * @param {string?} descriptionOverride
 */
function completeAdventure(adventure, thread, endState, descriptionOverride) {
	const { messages: messageManager } = thread;
	fetchRecruitMessage(thread, adventure.messageIds.recruit).then(recruitMessage => {
		recruitMessage.edit({
			embeds: [generateRecruitEmbed(adventure)],
			components: []
		});
	})
	clearComponents(adventure.messageIds.battleRound, messageManager);
	clearComponents(adventure.messageIds.room, messageManager);
	[adventure.messageIds.utility].forEach(id => {
		if (id) {
			messageManager.delete(id).catch(console.error);
		}
	})

	adventure.state = endState;
	setAdventure(adventure);
	const company = getCompany(thread.guild.id);
	adventure.delvers.forEach(delver => company.adventuring.delete(delver.id));
	setCompany(company);
	return renderRoom(adventure, thread, descriptionOverride);
}

module.exports = {
	loadAdventures,
	getAdventure,
	setAdventure,
	nextRoom,
	endRoom,
	newRound,
	endRound,
	checkNextRound,
	fetchRecruitMessage,
	completeAdventure
};
