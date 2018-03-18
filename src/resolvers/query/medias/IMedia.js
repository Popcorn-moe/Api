import { needAuth, now } from "../../util";
import { linkMedia } from "../../mutations/medias";
import { ObjectID } from "mongodb";

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

export function comment({ id }, { content }, context) {
	needAuth(context);
	const comment = {
		content,
		posted: now(),
		edited: null,
		reply_type: "MEDIA",
		reply_to: new ObjectID(id),
		user: new ObjectID(context.user.id)
	};
	return context.db
		.collection("comments")
		.insertOne(comment)
		.then(({ insertedId }) => ({
			...comment,
			id: insertedId
		}));
}

export function comments_count({ id }, args, context) {
	return context.db
		.collection("comments")
		.find({ reply_type: "MEDIA", reply_to: new ObjectID(id) })
		.count();
}

export function comments({ id }, { limit, offset }, context) {
	return context.db
		.collection("comments")
		.find({ reply_type: "MEDIA", reply_to: new ObjectID(id) })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.limit(limit)
		.skip(offset || 0)
		.toArray();
}
