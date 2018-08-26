import { getNotifications } from "./Query";
import { ObjectID } from "mongodb";
import md5 from "md5";

export function notifications({ id: user }, args, context) {
	return getNotifications(null, user, context);
}

export function avatar({ avatar, email }, args, context) {
	return (
		avatar ||
		`https://www.gravatar.com/avatar/${md5(
			email.toLowerCase().trim()
		)}?d=identicon`
	);
}

export function followers({ id }, args, { db }) {
	return db
		.collection("users")
		.find({ follows: new ObjectID(id) })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export async function isFollower(root, { id }, { db }) {
	return !!(await db
		.collection("users")
		.find({ _id: new ObjectID(id), follows: new ObjectID(root.id) })
		.limit(1)
		.map(({ _id }) => ({ id: _id }))
		.next());
}

export function meta({ metas }, { anime }, context) {
	return metas && metas.hasOwnProperty(anime) && metas[anime];
}

export function metas({ metas }, args, context) {
	return (
		metas &&
		Object.keys(metas).map(anime => ({
			...metas[anime],
			anime
		}))
	);
}
