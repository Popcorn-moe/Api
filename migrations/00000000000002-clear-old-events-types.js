export async function up(driver) {
	const db = await driver._run("getDbInstance");
	const events = db.collection("events");
	return events.deleteMany({ type: "NEW_FRIEND" });
}

export async function down(driver) {
	const db = await driver._run("getDbInstance");
}

export const _meta = {
	version: 1
};
