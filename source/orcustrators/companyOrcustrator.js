const fs = require("fs");
const { Company } = require("../classes");
const { ensuredPathSave } = require("../util/fileUtil");

const dirPath = "./saves";
const fileName = "companies.json";
const filePath = `${dirPath}/${fileName}`;
const requirePath = "./../saves/companies.json";
const companyDictionary = new Map();

async function loadCompanies() {
	if (fs.existsSync(filePath)) {
		const companies = require(requirePath);
		companies.forEach(company => {
			company.adventuring = new Set(company.adventurerIds);
			companyDictionary.set(company.id, company);
		})
		return `${companies.length} companies loaded`;
	} else {
		ensuredPathSave(dirPath, fileName, "[]");
		return "companies regenerated";
	}
}

function getCompany(guildId) {
	if (!guildId) {
		throw new Error("Attempted to get company with falsey id");
	}

	const company = companyDictionary.get(guildId);
	if (!company) {
		company = new Company(guildId);
		setCompany(company);
	}
	return company;
}

function setCompany(guildProfile) {
	companyDictionary.set(guildProfile.id, guildProfile);
	ensuredPathSave("./saves", "companies.json", JSON.stringify(Array.from((companyDictionary.values())).map(guild => {
		guild.adventurerIds = Array.from(guild.adventuring.values());
		return guild;
	})));
}

module.exports = {
	loadCompanies,
	getCompany,
	setCompany
};
