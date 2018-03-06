import { now, needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

export async function addMedia(root, { media }, context) {
	await needGroup(context, ADMIN);

	media.comments = [];
	media.rate = 0;
	media.edit_date = now();
	media.posted_date = now();

	return context.db
		.collection("medias")
		.insertOne(media)
		.then(({ ops: [{ _id, ...result }] }) => ({ id: _id, ...result }));
}

export async function updateMedia(root, { id, media }, context) {
	await needGroup(context, ADMIN);

	media.edit_date = now();

	await context.db
		.collection("medias")
		.updateOne({ _id: new ObjectID(id) }, { $set: media });

	return id;
}

export async function linkMedia(
	root,
	{ media, anime, season, episode },
	context
) {
	await needGroup(context, ADMIN);

	const update =
		season !== null && episode !== null
			? {
					$push: {
						[`seasons.${season.toString()}.episodes`]: {
							$each: [media],
							$position: episode
						}
					}
				}
			: { $push: { medias: media } };

	return context.db
		.collection("animes")
		.updateOne({ _id: anime }, update)
		.then(({ matchedCount }) => matchedCount == 1);
}
