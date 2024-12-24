const { Colors } = require("discord.js");

const ESSENCES = {
	Darkness: {
		color: Colors.DarkPurple,
		emoji: "💀",
		opposite: "Light",
		counters: ["Earth", "Water"]
	},
	Earth: {
		color: Colors.DarkGreen,
		emoji: "🌿",
		opposite: "Wind",
		counters: ["Light", "Water"]
	},
	Fire: {
		color: Colors.Orange,
		emoji: "🔥",
		opposite: "Water",
		counters: ["Darkness", "Earth"]
	},
	Light: {
		color: Colors.Yellow,
		emoji: "✨",
		opposite: "Darkness",
		counters: ["Fire", "Wind"]
	},
	Water: {
		color: Colors.Blue,
		emoji: "🌧️",
		opposite: "Fire",
		counters: ["Light", "Wind"]
	},
	Wind: {
		color: Colors.Aqua,
		emoji: "💨",
		opposite: "Earth",
		counters: ["Darkness", "Fire"]
	},
	Unaligned: {
		color: Colors.Greyple,
		emoji: "🌐",
		opposite: "Unaligned",
		counters: []
	}
}

/** @typedef {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} Essence */

/** Get a list of all essences sans provided exclusions
 * @param {Essence[]} exclusions
 */
function essenceList(exclusions = []) {
	return Object.keys(ESSENCES).filter(essence => !exclusions.includes(essence));
}

/** Get the essences that receive increased damage from the given essence
 * @param {Essence} essence
 * @returns {Essence[]}
 */
function getCounteredEssences(essence) {
	return ESSENCES[essence]?.counters ?? [];
}

/** Each essence has an assigned Discord parseable color
 * @param {Essence} essence
 * @returns {Colors}
 */
function getColor(essence) {
	return ESSENCES[essence]?.color || ESSENCES["Unaligned"].color;
}

/** @param {Essence} essence */
function getEmoji(essence) {
	return ESSENCES[essence]?.emoji || "❓";
}

/**
 * @param {Essence} essence
 * @returns {Essence}
 */
function getOpposite(essence) {
	return ESSENCES[essence]?.opposite || "Unaligned";
}

module.exports = {
	essenceList,
	getCounteredEssences,
	getColor,
	getEmoji,
	getOpposite
}
