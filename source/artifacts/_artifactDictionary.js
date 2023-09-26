const { ArtifactTemplate, Adventure } = require("../classes");

/** @type {Record<string, ArtifactTemplate>} */
const ARTIFACTS = {};

/** @type {{"Earth": ArtifactTemplate[], "Wind": ArtifactTemplate[], "Water": ArtifactTemplate[], "Fire": ArtifactTemplate[], "Untyped": ArtifactTemplate[]}} */
const ROLL_TABLE = {
	Darkness: [],
	Earth: [],
	Fire: [],
	Light: [],
	Wind: [],
	Water: [],
	Untyped: []
}

for (const file of [
	"amethystspyglass.js",
	"bloodshieldsword.js",
	"crystalshard.js",
	"enchantedmap.js",
	"hammerspaceholster.js",
	"hawktailfeather.js",
	"negativeoneleafclover.js",
	"oilpainting.js",
	"phoenixfruitblossom.js",
	"piggybank.js",
	"spiralfunnel.js"
]) {
	/** @type {ArtifactTemplate} */
	const artifact = require(`./${file}`);
	ARTIFACTS[artifact.name] = artifact;
	ROLL_TABLE[artifact.element].push(artifact.name);
}

/** @param {string} artifactName */
exports.getArtifact = function (artifactName) {
	return ARTIFACTS[artifactName];
}

exports.getArtifactCounts = function () {
	return Object.values(ARTIFACTS).length; //TODO #225 separate artifact counts by element
}

/** @param {Adventure} adventure */
exports.rollArtifact = function (adventure) {
	/** @type {ArtifactTemplate[]} */
	const artifactPool = adventure.getElementPool().reduce((artifacts, element) => artifacts.concat(ROLL_TABLE[element]), []);
	return artifactPool[adventure.generateRandomNumber(artifactPool.length, "general")];
}

exports.getAllArtifactNames = function () {
	return Object.keys(ARTIFACTS);
}
