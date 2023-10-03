const { ArtifactTemplate } = require("../classes");

module.exports = new ArtifactTemplate("Negative-One Leaf Clover",
	"Increases chance of finding upgraded gear by @{0.80^copies*-1+1*100}%.",
	"Increase upgrade chance (multiplicatively) by 20% per clover",
	"Untyped"
);
