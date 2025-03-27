const { SubcommandWrapper } = require("../../classes");
const { inspectSelfPayload } = require("../../util/embedUtil");
const { ICON_INSPECT_SELF } = require("../../constants");

module.exports = new SubcommandWrapper("inspect-self", `${ICON_INSPECT_SELF} Get your adventure-specific stats`,
	async function executeSubcommand(interaction, ...[adventure, delver]) {
		interaction.reply(inspectSelfPayload(delver, adventure))
			.catch(console.error);
	}
);
