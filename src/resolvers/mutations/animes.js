import { toId, now, needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

export function updateAnime(root, { id, anime }, context) {
	return transformAnime(anime, now(), context.storage).then(anime =>
		needGroup(context, ADMIN).then(() =>
			context.db
				.collection("animes")
				.updateOne({ _id: id }, { $set: anime })
				.then(() => id)
		)
	);
}

export function addAnime(root, { anime }, context) {
	const time = now();
	return transformAnime(anime, time, context.storage).then(anime => {
		anime.posted_date = time;
		anime._id = toId(anime.names[0]);
		anime.tags = anime.tags.map(t => new ObjectID(t));
		anime.authors = anime.authors.map(a => new ObjectID(a));
		return needGroup(context, ADMIN).then(() =>
			context.db
				.collection("animes")
				.insertOne({
					...anime,
					medias: [],
					seasons: []
				})
				.then(({ insertedId }) => insertedId)
		);
	});
}

function transformAnime(anime, time, storage) {
	return Promise.all([
		anime.cover.then(cover => cover && storage.save(cover)),
		anime.background.then(background => background && storage.save(background))
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
