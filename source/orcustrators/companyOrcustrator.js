const fs = require("fs");
const { Company } = require("../classes");

const { ensuredPathSave } = require("../util/fileUtil");

const dirPath = "./saves";
const fileName = "companies.json";
const filePath = `${dirPath}/${fileName}`;
const requirePath = "../../saves/companies.json";
/** @type {Map<string, Company>} */
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

/** @param {string} companyId */
function getCompany(companyId) {
	if (!companyId) {
		throw new Error("Attempted to get company with falsey id");
	}

	let company = companyDictionary.get(companyId);
	if (!company) {
		company = new Company(companyId);
		setCompany(company);
	}
	return company;
}

/** @param {Company} company */
function setCompany(company) {
	companyDictionary.set(company.id, company);
	ensuredPathSave("./saves", "companies.json", JSON.stringify(Array.from((companyDictionary.values())).map(company => {
		company.adventurerIds = Array.from(company.adventuring.values());
		return company;
	})));
}

module.exports = {
	loadCompanies,
	getCompany,
	setCompany
};
