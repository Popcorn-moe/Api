export async function up(driver, done) {
	const db = await driver._run("getDbInstance");
	const animes = db.collection("animes");
	const animesNew = db.collection("animesNew");
	const saves = [];
	return animes.find().forEach(
		doc => {
			doc.cover = {
				normal: doc.cover,
				big: doc.cover
			};
			saves.push(animesNew.save(doc));
		},
		() =>
			Promise.all(saves).then(() =>
				animesNew.rename("animes", { dropTarget: true }, done)
			)
	);
}

export async function down(driver) {
	const db = await driver._run("getDbInstance");
	return db.collection("animesNew").drop();
}

export const _meta = {
	version: 1
};
