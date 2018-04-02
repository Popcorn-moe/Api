import { toId, now } from "../util";
import { ObjectID } from "mongodb";
import sharp from "sharp";

export function updateAnime(root, { id, anime }, context) {
	return transformAnime(id, anime, now(), context.storage).then(anime =>
		context.db
			.collection("animes")
			.updateOne({ _id: id }, { $set: anime })
			.then(() => id)
	);
}

export function addAnime(root, { anime }, context) {
	const time = now();
	const id = toId(anime.names[0]);
	return transformAnime(id, anime, time, context.storage).then(anime => {
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
	});
}

function transformAnime(id, anime, time, storage) {
	const sharpOptions = { progressive: true, quality: 100, optimiseScans: true };
	return Promise.all([
		anime.cover &&
			anime.cover.then(cover =>
				Promise.all([
					storage.save(
						`${id}_cover`,
						cover,
						sharp()
							.resize(180, 250)
							.jpeg(sharpOptions)
					),
					storage.save(
						`${id}_cover_big`,
						cover,
						sharp()
							.resize(720, 1000)
							.jpeg(sharpOptions)
					)
				])
			),
		anime.background &&
			anime.background.then(background =>
				storage.save(`${id}_background`, background, sharp().jpeg(sharpOptions))
			)
	]).then(([[normal, big] = [], background]) => {
		anime.cover = {
			normal,
			big
		};
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
	return context.db
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
		.then(() => ({ anime, ...season }));
}
