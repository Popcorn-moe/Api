import { linkMedia } from "../mutations/medias";

export function linkTo(root, { anime, season, episode }, context) {
	return linkMedia(root, { media: root.id, anime, season, episode }, context);
}

export function comment(root, { content, reply_to }, context) {
	needAuth(context);
	const comment = {
		media: new ObjectID(root.id),
		content,
		posted: now(),
		edited: null,
		reply_to: new ObjectID(reply_to),
		user: new ObjectID(context.user.id)
	};
	return context.db
		.collection("comments")
		.insertOne(comment)
		.then(({ insertedId, ...o }) => ({
			...o,
			id: insertedId,
			media: root.id,
			reply_to
		}));
}
