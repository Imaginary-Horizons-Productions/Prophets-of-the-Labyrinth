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
	"boatparts.js",
	"celestialknightinsignia.js",
	"crystalshard.js",
	"enchantedmap.js",
	"hammerspaceholster.js",
	"hawktailfeather.js",
	"healthinsuranceloophole.js",
	"negativeoneleafclover.js",
	"oilpainting.js",
	"phoenixfruitblossom.js",
	"piggybank.js",
	"spiralfunnel.js",
	"weaponpolish.js"
]) {
	/** @type {ArtifactTemplate} */
	const artifact = require(`./${file}`);
	ARTIFACTS[artifact.name] = artifact;
	ROLL_TABLE[artifact.element].push(artifact.name);
}

/** @param {string} artifactName */
function getArtifact(artifactName) {
	return ARTIFACTS[artifactName];
}

function getArtifactCounts() {
	return Object.values(ARTIFACTS).length;
}

/** @param {Adventure} adventure */
function rollArtifact(adventure) {
	/** @type {string[]} */
	const artifactPool = adventure.getElementPool().reduce((artifacts, element) => artifacts.concat(ROLL_TABLE[element]), []);
	return artifactPool[adventure.generateRandomNumber(artifactPool.length, "general")];
}

module.exports = {
	artifactNames: Object.keys(ARTIFACTS),
	getArtifact,
	getArtifactCounts,
	rollArtifact
};
