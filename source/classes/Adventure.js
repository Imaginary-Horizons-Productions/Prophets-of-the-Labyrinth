const crypto = require("crypto");
const { MAX_MESSAGE_ACTION_ROWS } = require("../constants.js");
const { CombatantReference, Move } = require("./Move.js");
const { Combatant, Delver } = require("./Combatant.js");

class Adventure {
	/** NOTE: The setters in this class are require for a well formed entity. Currently procrastinating on refactoring /delve to fix that.
	 * @param {string} seedInput
	 * @param {string} guildIdInput
	 * @param {string} labyrinthInput
	 * @param {string} leaderIdInput
	 */
	constructor(seedInput, guildIdInput, labyrinthInput, leaderIdInput) {
		this.initialSeed = seedInput || Date.now().toString();
		this.guildId = guildIdInput;
		this.labyrinth = labyrinthInput;
		this.leaderId = leaderIdInput;
	}
	/** @type {string} should match the id of the adventure's thread */
	id;
	/** @type {string} */
	name;
	/** @type {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} */
	element;
	/** @type {"config" | "ongoing" | "success" | "defeat" | "giveup"} */
	state = "config";
	static endStates = ["success", "defeat", "giveup"];
	element;
	messageIds = {
		recruit: "",
		utility: "",
		room: "",
		battleRound: ""
	};
	/** @type {Delver[]} */
	delvers = [];
	/** @type {{[challengeName: string]: Challenge}} */
	challenges = {};
	scouting = {
		finalBoss: false,
		artifactGuardians: 0,
		artifactGuardiansEncountered: 0
	}
	finalBoss = "";
	/** @type {string[]} */
	artifactGuardians = [];
	accumulatedScore = 0;
	depth = 1;
	/** @type {Room} */
	room = {};
	/** @type {{[candidate: string]: string[]}} */
	roomCandidates = {};
	lives = 2;
	gold = 100;
	peakGold = 100;
	/** @type {Record<string, {count: number; [statistic: string]: number}>} */
	artifacts = {};
	/** @type {{[itemName: string]: number}} */
	items = {};
	rnIndices = {
		general: 0,
		battle: 0
	};
	rnTable = "";

	/** @param {string} threadId */
	setId(threadId) {
		this.id = threadId;
		return this;
	}

	/** @param {string} adventureName */
	setName(adventureName) {
		this.name = adventureName;
		return this;
	}

	/** @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} */
	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	generateRNTable() {
		let hash = crypto.createHash("sha256").update(this.initialSeed).digest("hex");
		let segments = [];
		for (let i = 0; i < hash.length; i += 4) {
			segments.push(hash.slice(i, i + 4));
		}
		this.rnTable = segments.reduce((table, segment) => table + parseInt(segment, 16).toString(12), "");
		return this;
	}

	/** Generate an integer between 0 and the given `exclusiveMax`
	 * @param {number} exclusiveMax the integer after the max roll
	 * @param {"general" | "battle"} branch which rnTable branch to roll on
	 */
	generateRandomNumber(exclusiveMax, branch) {
		if (typeof exclusiveMax !== 'number' || isNaN(exclusiveMax)) {
			throw new Error(`generateRandomNumber recieved invalid exclusiveMax: ${exclusiveMax}`);
		}

		if (exclusiveMax === 1) {
			return 0;
		} else {
			const digits = Math.ceil(Math.log2(exclusiveMax) / Math.log2(12));
			const start = this.rnIndices[branch];
			const end = start + digits;
			this.rnIndices[branch] = end % this.rnTable.length;
			const max = 12 ** digits;
			const sectionLength = max / exclusiveMax;
			const roll = parseInt(this.rnTable.slice(start, end), 12);
			return Math.floor(roll / sectionLength);
		}
	}

	/** Get an array with Untyped and all elements in the party
	 * @returns {("Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped")[]}
	 */
	getElementPool() {
		const pool = ["Untyped"];
		this.delvers.forEach(delver => {
			if (!pool.includes(delver.element)) {
				return pool.push(delver.element);
			}
		})
		return pool;
	}

	/** @param {string} artifactName */
	getArtifactCount(artifactName) {
		return this.artifacts[artifactName]?.count || 0;
	}

	/** @param {string} challengeName */
	getChallengeIntensity(challengeName) {
		return this.challenges[challengeName]?.intensity || 0;
	}

	/** @param {string} challengeName */
	getChallengeDuration(challengeName) {
		return this.challenges[challengeName]?.duration || 0;
	}

	getGearCapacity() {
		let count = 3 + this.getArtifactCount("Hammerspace Holster") - this.getChallengeIntensity("Can't Hold All this Value");
		count = Math.min(MAX_MESSAGE_ACTION_ROWS, count);
		count = Math.max(1, count);
		return count;
	}

	/** Get a delver or enemy based on the team and index of the combatant
	 * @param {CombatantReference} reference
	 * @returns {Combatant | null}
	 */
	getCombatant({ team, index }) {
		switch (team) {
			case "delver":
				return this.delvers[index];
			case "enemy":
				return this.room.enemies[index];
			case "none":
				return null;
		}
	}

	/** @param {Combatant} combatant */
	getCombatantIndex(combatant) {
		if (!combatant) {
			return;
		}
		if (combatant.team === "delver") {
			return this.delvers.findIndex(delver => delver.id === combatant.id);
		} else {
			return this.room.enemies.findIndex(enemy => enemy.id === combatant.id && enemy.name === combatant.name);
		}
	}

	/** @param {number} integer */
	gainGold(integer) {
		this.gold += integer;
		if (this.gold > this.peakGold) {
			this.peakGold = this.gold;
		}
		return this.gold;
	}

	/**
	 * @param {string} artifact
	 * @param {number} count
	 */
	gainArtifact(artifact, count) {
		if (artifact === "Oil Painting") {
			this.gainGold(500 * count);
			this.updateArtifactStat(artifact, "Gold Gained", 500 * count);
		} else if (artifact === "Phoenix Fruit Blossom") {
			this.lives += count;
			this.updateArtifactStat(artifact, "Lives Gained", count);
		} else if (artifact === "Hammerspace Holster") {
			this.updateArtifactStat(artifact, "Extra Gear Capacity", count);
		}
		if (artifact in this.artifacts) {
			this.artifacts[artifact].count += count;
		} else {
			this.artifacts[artifact] = { count: count };
		}
	}

	/**
	 * @param {string} artifactName
	 * @param {string} statName the stat to add to (in case of multiple stats per artifact)
	 * @param {number} stat the amount to be added
	 */
	updateArtifactStat(artifactName, statName, stat) {
		if (this.artifacts[artifactName]) {
			if (statName in this.artifacts[artifactName]) {
				this.artifacts[artifactName][statName] += stat;
			} else {
				this.artifacts[artifactName][statName] = stat;
			}
		}
	}

	/** Applies relics, challenges, etc to scouting cost
	 * @param {"Final Battle" | "Artifact Guardian"} type
	 */
	calculateScoutingCost(type) {
		const count = this.getArtifactCount("Amethyst Spyglass");
		switch (type) {
			case "Final Battle":
				return Math.max(150 - (count * 15), 0);
			case "Artifact Guardian":
				return Math.max(100 - (count * 15), 0);
		}
	}

	/** Initializes a resource in the room's resources if it's not already present
	 * @param {string} nameInput Note: all names in the combined pool of gear, artifacts, items, and resources must be unique
	 * @param {"gear" | "artifact" | "gold" | "scouting" | "roomAction" | "challenge"| "item"} resourceTypeInput
	 * @param {"loot" | "always" | "internal"} visibilityInput "loot" only shows in end of room loot, "always" always shows in ui, "internal" never shows in ui
	 * @param {number} countInput
	 * @param {string?} uiGroupInput
	 * @param {number?} costInput
	 */
	addResource(nameInput, resourceTypeInput, visibilityInput, countInput, uiGroupInput, costInput) {
		if (nameInput in this.room.resources) {
			this.room.resources[nameInput].count += countInput;
		} else {
			const resource = {
				name: nameInput,
				resourceType: resourceTypeInput,
				visibility: visibilityInput,
				count: countInput
			};
			if (costInput) {
				resource.cost = costInput;
			} else {
				resource.cost = 0;
			}
			if (uiGroupInput) {
				resource.uiGroup = uiGroupInput;
			}
			this.room.resources[nameInput] = resource;
		}
	}
};

class Challenge {
	/**
	 * @param {number} intensityInput
	 * @param {number} rewardInput
	 * @param {number | null} durationInput
	 */
	constructor(intensityInput, rewardInput, durationInput) {
		this.intensity = intensityInput;
		this.reward = rewardInput;
		this.duration = durationInput;
	}
};

class Room {
	/** This read-write payload class describes a room in an adventure
	 * @param {string} titleInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} elementEnum
	 * @param {{[enemyName: string]: number}} enemyList
	 */
	constructor(titleInput, elementEnum, enemyList) {
		this.title = titleInput;
		this.element = elementEnum;
		if (Object.keys(enemyList).length > 0) {
			this.round = -1;
			this.moves = [];
			this.enemies = [];
			this.enemyIdMap = {};
		}
	}
	/** @type {number | null} */
	round = null;
	/** @type {Move[] | null} */
	moves = null;
	/** @type {Enemy[] | null} */
	enemies = null;
	/** @type {{[enemyName: string]: number} | null} */
	enemyIdMap = null;
	/** @type {Record<string, {name: string, type: "gear" | "artifact" | "gold" | "scouting" | "roomAction" | "challenge"| "item", visibility: "loot" | "always" | "internal", count: number, uiGroup?: string, cost?: number}>} */
	resources = {};
}

class Enemy extends Combatant {
	/** This read-only data class defines an enemy players can fight
	 * @param {string} nameInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}" | "@{clone}"} elementEnum
	 * @param {number} speedInput
	 * @param {number} poiseInput
	 * @param {number} critBonusInput
	 * @param {string} firstActionName
	 * @param {{[modifierName]: number}} startingModifiersShallowCopy
	 */
	constructor(nameInput, elementEnum, speedInput, poiseInput, critBonusInput, firstActionName, startingModifiersShallowCopy) {
		super(nameInput, "enemy");
		this.archetype = nameInput;
		/** @type {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} */
		this.element = elementEnum;
		this.speed = speedInput;
		this.poise = poiseInput;
		this.critBonus = critBonusInput;
		this.nextAction = firstActionName;
		this.modifiers = startingModifiersShallowCopy;
	}

	/** @param {number} integer */
	setHP(integer) {
		this.hp = integer;
		this.maxHP = integer;
		return this;
	}

	/** @param {Adventure} adventure */
	setId(adventure) {
		if (adventure.room.enemyIdMap[this.name]) {
			adventure.room.enemyIdMap[this.name]++;
			this.id = adventure.room.enemyIdMap[this.name];
		} else {
			adventure.room.enemyIdMap[this.name] = 1;
			this.id = 1;
		}
	}

	/** @param {{[enemyName: string]: number}} enemyIdMap */
	getName(enemyIdMap) {
		if (enemyIdMap[this.name] > 1) {
			return `${this.name} ${this.id}`;
		} else {
			return this.name;
		}
	}
};

module.exports = {
	Adventure,
	Challenge,
	Enemy,
	Room
}
