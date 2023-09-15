const { Archetype } = require("../classes");

/** @type {Record<string, Archetype>} */
const archetypeDictionary = {};

for (const file of [
	"assassin.js",
	"chemist.js",
	"hemomancer.js",
	"knight.js",
	"legionnaire.js",
	"martialartist.js",
	"ritualist.js"
]) {
	const archetype = require(`./${file}`);
	archetypeDictionary[archetype.name] = archetype;
}

/** @param {string} archetypeName */
exports.getArchetype = function (archetypeName) {
	return archetypeDictionary[archetypeName];
}
