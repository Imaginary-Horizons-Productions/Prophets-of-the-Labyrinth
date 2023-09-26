const { Colors } = require("discord.js");

const ELEMENTS = {
	"Darkness": {
		color: Colors.DarkPurple,
		emoji: "☠",
		opposite: "Light",
		weaknesses: ["Fire", "Water"],
		resistances: ["Earth", "Wind"]
	},
	"Earth": {
		color: Colors.DarkGreen,
		emoji: "🌿",
		opposite: "Wind",
		weaknesses: ["Darkness", "Fire"],
		resistances: ["Light", "Water"]
	},
	"Fire": {
		color: Colors.Orange,
		emoji: "🔥",
		opposite: "Water",
		weaknesses: ["Light", "Wind"],
		resistances: ["Darkness", "Earth"]
	},
	"Light": {
		color: Colors.Yellow,
		emoji: "✨",
		opposite: "Darkness",
		weaknesses: ["Earth", "Wind"],
		resistances: ["Fire", "Water"]
	},
	"Water": {
		color: Colors.Blue,
		emoji: "💦",
		opposite: "Fire",
		weaknesses: ["Earth", "Light"],
		resistances: ["Darkness", "Wind"]
	},
	"Wind": {
		color: Colors.Aqua,
		emoji: "💨",
		opposite: "Earth",
		weaknesses: ["Darkness", "Water"],
		resistances: ["Fire", "Light"]
	},
	"Untyped": {
		color: Colors.Greyple,
		emoji: "🌐",
		opposite: "Untyped",
		weaknesses: [],
		resistances: []
	}
}

/** Get a list of all elements sans provided exclusions
 * @param {string[]} exclusions
 */
function elementsList(exclusions = []) {
	return Object.keys(ELEMENTS).filter(element => !exclusions.includes(element));
}


/** Get the elements that deals increased damage to the given element
 * @param {string} element
 * @returns {string[]}
 */
function getWeaknesses(element) {
	return ELEMENTS[element]?.weaknesses ?? [];
}

/** Get the elements that deals reduced damage to the given element
 * @param {string} element
 * @returns {string[]}
 */
function getResistances(element) {
	return ELEMENTS[element]?.resistances ?? [];
}
/** Each element has an assigned Discord parseable color
 * @param {string} element
 * @returns {Colors}
 */
function getColor(element) {
	return ELEMENTS[element]?.color || ELEMENTS["Untyped"].color;
}

/** Each element has an associated emoji
 * @param {string} element
 */
function getEmoji(element) {
	return ELEMENTS[element]?.emoji || "❓";
}

/** Used in "opposite of adventure" element
 * @param {string} element
 * @returns {string}
 */
function getOpposite(element) {
	return ELEMENTS[element]?.opposite || "Untyped";
}

module.exports = {
	elementsList,
	getResistances,
	getWeaknesses,
	getColor,
	getEmoji,
	getOpposite
}
