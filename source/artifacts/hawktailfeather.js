const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Hawk Tailfeather",
	"Increases the chance moves will critically hit by @{0.85^copies*-1+1*100}%.",
	"Increase chance of crit (multiplicatively) by 15% per feather",
	"Untyped"
);
