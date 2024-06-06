const { ArtifactTemplate, Adventure } = require("../classes");

/** @type {Record<string, ArtifactTemplate>} */
const ARTIFACTS = {};
const ARTIFACT_NAMES = [];

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
	"floatingmultiplier.js",
	"hammerspaceholster.js",
	"hawktailfeather.js",
	"healthinsuranceloophole.js",
	"manualmanual.js",
	"negativeoneleafclover.js",
	"oilpainting.js",
	"peacockcharm.js",
	"phoenixfruitblossom.js",
	"piggybank.js",
	"spiralfunnel.js",
	"weaponpolish.js"
]) {
	/** @type {ArtifactTemplate} */
	const artifact = require(`./${file}`);
	ARTIFACTS[artifact.name.toLowerCase()] = artifact;
	ARTIFACT_NAMES.push(artifact.name);
	ROLL_TABLE[artifact.element].push(artifact.name);
}

/** @param {string} artifactName */
function getArtifact(artifactName) {
	return ARTIFACTS[artifactName.toLowerCase()];
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
	artifactNames: ARTIFACT_NAMES,
	getArtifact,
	getArtifactCounts,
	rollArtifact
};
