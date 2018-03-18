import { userById } from "./query";
import { needAuth, now } from "../util";
import { ObjectID } from "mongodb";

export function user(root, args, context) {
	return userById(null, { id: root.user }, context);
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

export function reply({ reply_type, id }, { content }, context) {
	needAuth(context);
	if (reply_type == "COMMENT")
		throw new Error("Cannot make a comment of comment");
	const comment = {
		content,
		posted: now(),
		edited: null,
		reply_type: "COMMENT",
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
