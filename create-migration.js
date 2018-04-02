const { writeFileSync, readdirSync } = require("fs");
const { lpad } = require("db-migrate-shared").util;
const inflection = require("inflection");
const { join } = require("path");

const [, , name] = process.argv;
const dir = join(__dirname, "migrations");

const files = readdirSync(dir);
const nb =
	files.map(file => +file.slice(0, 14)).reduce((c, v) => Math.max(c, v), 0) + 1;

writeFileSync(
	join(
		__dirname,
		"migrations",
		`${nb.toString().padStart(14, "0")}-${inflection.dasherize(name)}.js`
	),
	`export function up(driver) {
	const db = await driver._run('getDbInstance');
}

export function down(driver) {
	const db = await driver._run('getDbInstance');
}

export const _meta = {
	version: 1
}
`
);
