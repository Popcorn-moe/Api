import { now, needGroup, ADMIN } from "../util/index";

export function addMedia(root, { media }, context) {
	media.comments = [];
	media.rate = 0;
	media.edit_date = now();
	media.posted_date = now();
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection("medias")
			.insertOne(media)
			.then(({ ops: [{ _id, ...result }] }) => ({ id: _id, ...result }))
	);
}

export function linkMedia(root, { media, anime, season, episode }, context) {
	let update;
	if (season && episode) {
		update = {
			$push: {
				[`seasons.${season.toString()}.episodes.${episode.toString()}`]: media
			}
		};
	} else {
		update = { $push: { medias: media } };
	}
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection("animes")
			.updateOne({ _id: anime }, update)
			.then(({ matchedCount }) => matchedCount == 1)
	);
}
