const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../classes');

const customId = "";
const options = [
	{
		type: "",
		name: "",
		description: "",
		required: false,
		autocomplete: [{ name: "", value: "" }], // optional
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
				autocomplete: [{ name: "", value: "" }], // optional
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
