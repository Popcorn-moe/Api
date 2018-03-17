import { ObjectID } from "mongodb";
import { userById } from "./query";
import needAuth from "../util";

export function user(root, args, context) {
	return userById(null, { id: root.user }, context);
}

export function replies(root, { limit, offset }, context) {
	return context.db
		.collection("comments")
		.find({ reply_type: "COMMENT", reply_to: root.id })
		.limit(Math.min(limit, 50))
		.skip(offset || 0)
		.toArray();
}
