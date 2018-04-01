import { getNotifications } from "./Query";
import { ObjectID } from "mongodb";
import md5 from "md5";

export function notifications(root, args, context) {
	return getNotifications(null, { user: root.id }, context);
}

export function avatar({ avatar, email }, args, context) {
	return (
		avatar ||
		`https://www.gravatar.com/avatar/${md5(
			email.toLowerCase().trim()
		)}?d=identicon`
	);
}

export function followers({ _id }, args, { db }) {
	return db
		.collection("users")
		.find({ follows: _id })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export async function isFollower(root, { id }, { db }) {
	return !!await db
		.collection("users")
		.find({ _id: new ObjectID(id), follows: new ObjectID(root.id) })
		.limit(1)
		.map(({ _id }) => ({ id: _id }))
		.next();
}
