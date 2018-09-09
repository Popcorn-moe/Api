import { now } from "../util";
import { ObjectID } from "mongodb";

export function addMedia(root, { media }, context) {
	media.comments = [];
	media.rate = 0;
	media.edit_date = now();
	media.posted_date = now();
	return context.db
		.collection("medias")
		.insertOne(media)
		.then(({ ops: [{ _id, ...result }] }) => ({ id: _id, ...result }));
}

export function updateMedia(root, { id, media }, context) {
	media.edit_date = now();
	return context.db
		.collection("medias")
		.updateOne({ _id: new ObjectID(id) }, { $set: media })
		.then(() => id);
}

export function deleteMedia(root, { id }, context) {
	return context.db
		.collection("medias")
		.deleteOne({ _id: new ObjectID(id) })
		.then(() => id);
}

export function linkMedia(root, { media, anime, season, episode }, context) {
	return Promise.all([
		context.db.collection("animes").updateOne(
			{ _id: anime },
			season !== null && episode !== null
				? {
						$push: {
							[`seasons.${season.toString()}.episodes`]: {
								$each: [media],
								$position: episode
							}
						}
				  }
				: { $push: { medias: media } }
		),
		context.db
			.collection("medias")
			.updateOne(
				{ _id: new ObjectID(media) },
				{ $set: { anime, episode, season } }
			)
	]).then(
		([{ matchedCount: animeCount }, { matchedCount: mediaCount }]) =>
			animeCount == 1 && mediaCount == 1
	);
}
