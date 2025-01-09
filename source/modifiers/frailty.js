const { ModifierTemplate } = require("../classes");

module.exports = new ModifierTemplate("Frailty",
	"Take @{stacks*20} (+@{funnelCount*2} on enemies due to Spiral Funnels) damage when Stunned",
	"Debuff",
	0,
	1
);
