import { linkMedia } from "../../mutations/medias";

export function __resolveType({ type }) {
	return type === "EPISODE" ? "Episode" : "Media";
}

export function linkTo(root, { anime, season, episode }, context) {
	return linkMedia(root, { media: root.id, anime, season, episode }, context);
}

export function anime({ anime }, args, context) {
	return context.db
		.collection("animes")
		.find({ _id: anime })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next();
}

export function comment(root, { content, reply_to }, context) {
	needAuth(context);
	const comment = {
		content,
		posted: now(),
		edited: null,
		reply_to: new ObjectID(reply_to || root.id),
		reply: !!reply_to,
		user: new ObjectID(context.user.id)
	};
	return context.db
		.collection("comments")
		.insertOne(comment)
		.then(({ insertedId, ...o }) => ({
			...o,
			id: insertedId
		}));
}

export function replies(root, { limit, offset }, context) {
	return context.db
		.collection("comments")
		.find({ reply_type: "MEDIA", reply_to: root.id })
		.limit(Math.min(limit, 50))
		.skip(offset || 0)
		.toArray();
}
