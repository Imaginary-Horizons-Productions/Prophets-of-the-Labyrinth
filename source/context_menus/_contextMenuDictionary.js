
const { ContextMenuWrapper, BuildError } = require("../classes");

const contextMenuFiles = [
	"PotL_Stats.js"
];

/** @type {Record<string, ContextMenuWrapper>} */
const CONTEXT_MENU_DICTIONARY = {};
module.exports = {
	contextMenuFiles,
	/** @type {import('discord.js').RESTPostAPIChatInputApplicationCommandsJSONBody[]} */
	contextMenuData: [],
	getContextMenu
};
for (const file of contextMenuFiles) {
	/** @type {ContextMenuWrapper} */
	const contextMenu = require(`./${file}`);
	if (contextMenu.mainId in CONTEXT_MENU_DICTIONARY) {
		throw new BuildError(`Duplicate context menu custom id: ${contextMenu.mainId}`)
	}
	CONTEXT_MENU_DICTIONARY[contextMenu.mainId] = contextMenu;
	module.exports.contextMenuData.push(contextMenu.builder.toJSON());
}
/** @param {string} mainId */
function getContextMenu(mainId) {
	return CONTEXT_MENU_DICTIONARY[mainId];
}
