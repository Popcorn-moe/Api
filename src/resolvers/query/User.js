import { ObjectID } from "mongodb";
import { getNotifications } from "./query";
import md5 from "md5";

export function playlists(root, args, context) {
	return context.db
		.collection("playlists")
		.find({ _id: { $in: root.playlists.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function friends(root, args, context) {
	return !root.friends
		? []
		: context.db
				.collection("users")
				.find({ _id: { $in: root.friends.map(id => new ObjectID(id)) } })
				.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
				.toArray();
}

export function blocked(root, args, context) {
	return context.db
		.collection("users")
		.find({ _id: { $in: root.blocked.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function notifications(root, args, context) {
	return getNotifications(null, { user: root.id }, context);
}

export function avatar({ avatar, email }, args, context) {
	return (
		avatar ||
		`https://www.gravatar.com/avatar/${md5(email.toLowerCase().trim())}`
	);
}
