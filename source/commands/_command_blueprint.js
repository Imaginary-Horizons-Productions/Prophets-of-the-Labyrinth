const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../classes');

const customId = "";
module.exports.autocomplete = {
	// NOTE: "option-name" must match the name of the option it contains autocomplete data for
	"option-name": [{ name: "", value: "" }]
};
const options = [
	{
		type: "",
		name: "",
		description: "",
		required: false,
		autocomplete: false, // optional
		choices: [{ name: "", value: "" }] // optional
	}
];
const subcommands = [
	{
		name: "",
		description: "",
		optionsInput: [
			{
				type: "",
				name: "",
				description: "",
				required: false,
				autocomplete: false, // optional
				choices: [{ name: "", value: "" }] // optional
			}
		]
	}
];
module.exports = new CommandWrapper(customId, "description", PermissionFlagsBits.ViewChannel, false, true, 3000, options, subcommands,
	/** Command specifications go here */
	(interaction) => {

	}
);
