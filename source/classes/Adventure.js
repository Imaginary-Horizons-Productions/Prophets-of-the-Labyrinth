const crypto = require("crypto");
const { MAX_MESSAGE_ACTION_ROWS, RN_TABLE_BASE, GAME_VERSION } = require("../constants.js");
const { CombatantReference, Move } = require("./Move.js");
const { Combatant, Delver } = require("./Combatant.js");
const { elementsList } = require("../util/elementUtil.js");
const { parseExpression } = require("../util/textUtil.js");

const allElements = elementsList();
const DESCRIPTORS = ["Shining", "New", "Dusty", "Old", "Floating", "Undersea", "Future", "Intense"];

class Adventure {
	/** NOTE: setId is require for a well formed entity. Currently procrastinating on refactoring /delve to fix that.
	 * @param {string} seedInput
	 * @param {string} guildIdInput
	 * @param {string} labyrinthInput
	 * @param {string} leaderIdInput
	 */
	constructor(seedInput, guildIdInput, labyrinthInput, leaderIdInput) {
		this.version = GAME_VERSION;
		this.initialSeed = seedInput || Date.now().toString();
		this.rnTable = crypto.createHash("sha256").update(this.initialSeed).digest("hex");
		this.guildId = guildIdInput;
		this.labyrinth = labyrinthInput;
		this.leaderId = leaderIdInput;
		this.element = allElements[this.generateRandomNumber(allElements.length, "general")];
		this.name = `${DESCRIPTORS[this.generateRandomNumber(DESCRIPTORS.length, "general")]} ${labyrinthInput} of ${this.element}`;
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
		bosses: 0,
		bossesEncountered: 0,
		artifactGuardians: 0,
		artifactGuardiansEncountered: 0
	}
	/** @type {string[]} */
	bosses = [];
	/** @type {string[]} */
	artifactGuardians = [];
	score = 0;
	depth = 1;
	/** @type {Room} */
	room = {};
	/** @type {{[candidate: string]: {voterIds: string[], isHidden: boolean}}} */
	roomCandidates = {};
	lives = 2;
	gold = 100;
	peakGold = 100;
	gearCapacity = 3;
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

	/** Generate an integer between 0 and the given `exclusiveMax`
	 * @param {number} exclusiveMax the integer after the max roll
	 * @param {"general" | "battle"} branch which rnTable branch to roll on
	 */
	generateRandomNumber(exclusiveMax, branch) {
		if (typeof exclusiveMax !== 'number' || isNaN(exclusiveMax) || exclusiveMax === 0) {
			throw new Error(`generateRandomNumber recieved invalid exclusiveMax: ${exclusiveMax}`);
		}

		if (exclusiveMax === 1) {
			return 0;
		} else {
			const digits = Math.ceil(Math.log2(exclusiveMax) / Math.log2(RN_TABLE_BASE));
			const start = this.rnIndices[branch];
			const end = start + digits;
			this.rnIndices[branch] = end % this.rnTable.length;
			const max = RN_TABLE_BASE ** digits;
			const sectionLength = max / exclusiveMax;
			let tableSegment = this.rnTable.slice(start, end);
			if (start > end) {
				tableSegment = `${this.rnTable.slice(start)}${this.rnTable.slice(0, end)}`;
			}
			const roll = parseInt(tableSegment, RN_TABLE_BASE);
			return Math.floor(roll / sectionLength);
		}
	}

	/** Calculates the adventure's score without end of run multipliers */
	getBaseScore() {
		const livesScore = this.lives * 10;
		const goldScore = Math.floor(Math.log10(this.peakGold)) * 5;
		return {
			livesScore,
			goldScore,
			total: this.score + this.depth + livesScore + goldScore
		};
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
		let count = this.gearCapacity + this.getArtifactCount("Hammerspace Holster") - this.getChallengeIntensity("Can't Hold All this Value");
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
		if (artifact in this.artifacts) {
			this.artifacts[artifact].count += count;
		} else {
			this.artifacts[artifact] = { count };
		}
		if (artifact === "Oil Painting") {
			this.gainGold(500 * count);
			this.updateArtifactStat(artifact, "Gold Gained", 500 * count);
		} else if (artifact === "Phoenix Fruit Blossom") {
			this.lives += count;
			this.updateArtifactStat(artifact, "Lives Gained", count);
		} else if (artifact === "Hammerspace Holster") {
			this.updateArtifactStat(artifact, "Extra Gear Capacity", count);
		}
	}

	/**
	 * @param {string} itemName
	 * @param {number} count
	 */
	gainItem(itemName, count) {
		if (itemName in this.items) {
			this.items[itemName] += count;
		} else {
			this.items[itemName] = count;
		}
	}

	/**
	 * @param {string} itemName
	 * @param {number} count
	 */
	decrementItem(itemName, count) {
		this.items[itemName] -= count;
		if (this.items[itemName] < 1) {
			delete this.items[itemName];
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
	 * @param {Record<string, string[]>} initialHistoryMap
	 * @param {{[enemyName: string]: number}} enemyList
	 */
	constructor(titleInput, elementEnum, initialHistoryMap, enemyList) {
		this.title = titleInput;
		this.element = elementEnum;
		this.history = initialHistoryMap;
		if (enemyList && Object.keys(enemyList).length > 0) {
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
	/** @type {Record<string, {name: string, type: "gear" | "artifact" | "gold" | "scouting" | "roomAction" | "challenge" | "item", visibility: "loot" | "always" | "internal", count: number, uiGroup?: string, cost?: number}>} */
	resources = {};
	/** @type {Record<string, string[]>} */
	history = {};

	/** checks if the given resource has the given count in the room
	 * @param {string} name
	 * @param {number?} count
	 */
	hasResource(name, count = 0) {
		return name in this.resources && this.resources[name].count >= count;
	}

	/** Initializes a resource in the room's resources if it's not already present
	 * @param {string} nameInput Note: all names in the combined pool of gear, artifacts, items, and resources must be unique
	 * @param {"gear" | "artifact" | "gold" | "scouting" | "roomAction" | "challenge" | "item"} typeInput
	 * @param {"loot" | "always" | "internal"} visibilityInput "loot" only shows in end of room loot, "always" always shows in ui, "internal" never shows in ui
	 * @param {number} countInput
	 * @param {string?} uiGroupInput
	 * @param {number?} costInput
	 */
	addResource(nameInput, typeInput, visibilityInput, countInput, uiGroupInput, costInput) {
		if (nameInput in this.resources) {
			this.resources[nameInput].count += countInput;
		} else {
			const resource = {
				name: nameInput,
				type: typeInput,
				visibility: visibilityInput,
				count: countInput
			};
			resource.cost = costInput ?? 0;
			if (uiGroupInput) {
				resource.uiGroup = uiGroupInput;
			}
			this.resources[nameInput] = resource;
		}
	}

	/** decrements a resource's count, deletes if reaching zero
	 * @param {string} name
	 * @param {number | "all"} decrement
	 */
	decrementResource(name, decrement) {
		if (decrement === "all" || this.resources[name].count <= decrement) {
			delete this.resources[name];
		} else {
			this.resources[name].count -= decrement;
		}
	}
}

class Enemy extends Combatant {
	/** This read-only data class defines an enemy players can fight
	 * @param {string} nameInput
	 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}" | "@{clone}"} elementEnum
	 * @param {number} powerInput
	 * @param {number} speedInput
	 * @param {number} poiseExpression
	 * @param {number} critRateInput
	 * @param {string} firstActionName
	 * @param {{[modifierName]: number}} startingModifiersShallowCopy
	 * @param {number} delverCount
	 */
	constructor(nameInput, bossesBeaten, elementEnum, powerInput, speedInput, poiseExpression, critRateInput, firstActionName, startingModifiersShallowCopy, delverCount) {
		super(nameInput, "enemy");
		this.archetype = nameInput;
		this.level = bossesBeaten;
		/** @type {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} */
		this.element = elementEnum;
		this.power = powerInput;
		this.speed = speedInput;
		if (poiseExpression && delverCount) { // allows parameterless class casting on load without crashing
			this.poise = parseExpression(poiseExpression, delverCount);
		}
		this.critRate = critRateInput;
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

	/** @returns {number} */
	getMaxHP() {
		return Math.floor(this.maxHP);
	}

	/** @returns {number} */
	getPower() {
		return Math.floor(this.power + this.getModifierStacks("Power Up") - this.getModifierStacks("Power Down"));
	}

	/** @param {boolean} includeRoundSpeed */
	getSpeed(includeRoundSpeed) {
		let totalSpeed = this.speed;
		if (includeRoundSpeed) {
			totalSpeed += this.roundSpeed;
		}
		if ("Slow" in this.modifiers) {
			const slowStacks = this.getModifierStacks("Slow");
			totalSpeed -= slowStacks * 5;
		}
		if ("Quicken" in this.modifiers) {
			const quickenStacks = this.getModifierStacks("Quicken");
			totalSpeed += quickenStacks * 5;
		}
		return Math.floor(totalSpeed);
	}

	/** @returns {number} */
	getCritRate() {
		return Math.floor(this.critRate);
	}

	/** @returns {number} */
	getPoise() {
		return Math.floor(this.poise);
	}

	getDamageCap() {
		return 450 + (this.level * 50) + this.getModifierStacks("Power Up");
	}
};

module.exports = {
	Adventure,
	Challenge,
	Enemy,
	Room
}
