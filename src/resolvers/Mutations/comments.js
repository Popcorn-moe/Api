import { ObjectID } from "mongodb";

export function deleteComment(root, { id }, context) {
	return context.db
		.collection("comments")
		.deleteOne({ _id: new ObjectID(id) })
		.then(() => id);
}
