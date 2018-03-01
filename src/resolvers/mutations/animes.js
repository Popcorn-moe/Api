import { toId, now, needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";
import sharp from "sharp";

export function updateAnime(root, { id, anime }, context) {
	return needGroup(context, ADMIN).then(() =>
		transformAnime(id, anime, now(), context.storage).then(anime =>
			context.db
				.collection("animes")
				.updateOne({ _id: id }, { $set: anime })
				.then(() => id)
		)
	);
}

export function addAnime(root, { anime }, context) {
	const time = now();
	const id = toId(anime.names[0]);
	return needGroup(context, ADMIN).then(() =>
		transformAnime(id, anime, time, context.storage).then(anime => {
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
		})
	);
}

function transformAnime(id, anime, time, storage) {
	return Promise.all([
		anime.cover &&
			anime.cover.then(cover =>
				storage.save(
					`${id}_cover`,
					cover,
					sharp()
						.resize(180, 250)
						.jpeg({ progressive: true, quality: 100, optimiseScans: true })
				)
			),
		anime.background &&
			anime.background.then(background =>
				storage.save(
					`${id}_background`,
					background,
					sharp().jpeg({ progressive: true, quality: 100, optimiseScans: true })
				)
			)
	]).then(([cover, background]) => {
		if (cover) anime.cover = cover;
		if (background) anime.background = background;
		anime.edit_date = time;
		return anime;
	});
}

export function addSeason(root, { anime, season }, context) {
	const seasonNb = season.season;
	delete season.season;
	const time = now();
	season.edit_date = time;
	season.posted_date = time;
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection("animes")
			.updateOne(
				{ _id: anime },
				{
					$push: {
						seasons: {
							$each: [season],
							$position: seasonNb
						}
					}
				}
			)
			.then(() => ({ anime, ...season }))
	);
}
