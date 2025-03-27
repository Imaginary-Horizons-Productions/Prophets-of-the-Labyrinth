const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("Adventurer",
	["Pirate", "Omenbringer", "Sentinel", "Vanguard"],
	"An Adventurer doesn't predict anything, but has double normal stat growths.",
	"Their Shortsword grants them @e{Finesse}.",
	"Fire",
	(embed, adventure) => {
		const descriptions = [
			`I'm an adventurer.`,
			`I have double stat growths!`,
			"¯\\_(ツ)\_/¯",
			`This delve into ${adventure.name} is exciting!`,
			`I *think* it's <t:${Math.floor(Date.now() / 1000)}:t>.`,
			`It's high noon... (<t:${Math.floor(new Date().setHours(12, 0, 0) / 1000)}:R> for the server)`,
			"There's supposed to be predictions here."
		];
		if (adventure.delvers.length > 1) {
			descriptions.push(`I'm so happy to have my ${adventure.delvers.length - 1} good friends with me.`);
		}
		return embed.setDescription(`Adventurer predictions for Round ${adventure.room.round + 1}:\n${descriptions[Date.now() % descriptions.length]}`);
	},
	(combatant) => "",
	{
		base: "Shortsword",
		Omenbringer: "Hexing Shortsword",
		Sentinel: "Vigilant Shortsword",
		Vanguard: "Flanking Shortsword",
		Pirate: "Midas's Shortsword"
	},
	["Cloak"],
	{
		maxHPGrowth: 50,
		powerGrowth: 5,
		speedGrowth: 1,
		critRateGrowth: 0.5,
		staggerCapGrowth: 0
	}
);
