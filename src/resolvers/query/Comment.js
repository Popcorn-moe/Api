import { userById } from "./query";
import { needAuth, now } from "../util";
import { ObjectID } from "mongodb";

export function user({ user }, args, context) {
	return userById(null, { id: user.toString() }, context);
}

export function replies({ id: reply_to }, { limit, offset }, context) {
	return context.db
		.collection("comments")
		.find({ reply_type: "COMMENT", reply_to })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.limit(limit)
		.skip(offset || 0)
		.toArray();
}

export function replies_count({ id }, args, context) {
	return context.db
		.collection("comments")
		.find({ reply_type: "COMMENT", reply_to: new ObjectID(id) })
		.count();
}

export function reply({ reply_type, id }, { content }, context) {
	needAuth(context);
	if (reply_type == "COMMENT")
		throw new Error("Cannot make a comment of comment");
	return context.user.then(({ id: userId }) => {
		const comment = {
			content,
			posted: now(),
			edited: null,
			reply_type: "COMMENT",
			reply_to: new ObjectID(id),
			user: new ObjectID(userId)
		};
		return context.db
			.collection("comments")
			.insertOne(comment)
			.then(({ insertedId }) => ({
				...comment,
				id: insertedId
			}));
	});
}
