import { toId, now, needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";
import sharp from "sharp";

export async function updateAnime(root, { id, anime }, context) {
	await needGroup(context, ADMIN);

	await transformAnime(id, anime, now(), context.storage);
	await context.db.collection("animes").updateOne({ _id: id }, { $set: anime });

	return id;
}

export async function addAnime(root, { anime }, context) {
	await needGroup(context, ADMIN);
	const time = now();
	const id = toId(anime.names[0]);

	await transformAnime(id, anime, time, context.storage);
	anime.posted_date = time;
	anime._id = id;
	anime.tags = anime.tags.map(t => new ObjectID(t));
	anime.authors = anime.authors.map(a => new ObjectID(a));

	return context.db
		.collection("animes")
		.insertOne({
			...anime,
			medias: [],
			seasons: []
		})
		.then(({ insertedId }) => insertedId);
}

export async function addSeason(root, { anime, season }, context) {
	await needGroup(context, ADMIN);
	const time = now();
	const seasonNb = season.season;

	delete season.season;
	season.edit_date = time;
	season.posted_date = time;

	await context.db
		.collection("animes")
		.updateOne(
			{ _id: anime },
			{ $push: { seasons: { $each: [season], $position: seasonNb } } }
		);

	return { anime, ...season };
}

async function transformAnime(id, anime, time, storage) {
	const options = {
		progressive: true,
		quality: 100,
		optimiseScans: true
	};

	const [cover, background] = await Promise.all([
		anime.cover &&
			storage.save(
				`${id}_cover`,
				anime.cover,
				sharp()
					.resize(180, 250)
					.jpeg(options)
			),

		anime.background &&
			storage.save(`${id}_background`, anime.background, sharp().jpeg(options))
	]);

	if (cover) anime.cover = cover;
	if (background) anime.background = background;

	anime.edit_date = time;
	return anime;
}
