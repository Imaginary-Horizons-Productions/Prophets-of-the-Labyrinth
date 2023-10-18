const fs = require('fs');

fs.cp("config_template", "config", { force: false, recursive: true }, (error) => {
	if (error) {
		throw error;
	}
});

fs.cp("saves_template", "saves", { force: false, recursive: true }, (error) => {
	if (error) {
		throw error;
	}
});
