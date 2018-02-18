import { ObjectID } from "mongodb";
import { getNotifications } from "./query";

export function playlists(root, args, context) {
	return context.db
		.collection("playlists")
		.find({ _id: { $in: root.playlists.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function friends(root, args, context) {
	return context.db
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
