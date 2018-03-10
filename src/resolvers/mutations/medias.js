import { now, needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

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

export function updateMedia(root, { id, media }, context) {
	media.edit_date = now();
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection("medias")
			.updateOne({ _id: new ObjectID(id) }, { $set: media })
			.then(() => id)
	);
}

export function deleteMedia(root, { id }, context) {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection("medias")
			.deleteOne({ _id: new ObjectID(id) })
			.then(() => id)
	);
}

export function linkMedia(root, { media, anime, season, episode }, context) {
	let update;
	if (season !== null && episode !== null) {
		update = {
			$push: {
				[`seasons.${season.toString()}.episodes`]: {
					$each: [media],
					$position: episode
				}
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
