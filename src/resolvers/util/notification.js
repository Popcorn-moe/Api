import { now } from "./";
import { ObjectID } from "mongodb";

export function notifyMessage({ user, message }, context) {
	const notif = {
		user: new ObjectID(user),
		date: now(),
		type: "MESSAGE",
		message
	};
	return context.db
		.collection("notifications")
		.insertOne(notif)
		.then(({ insertedId }) => {
			context.pubsub.publish("notification", notif);
			return insertedId;
		});
}

export function notifyAnimeFollow({ user, anime }, context) {
	const notif = {
		user: new ObjectID(user),
		date: now(),
		type: "ANIME_FOLLOW",
		anime
	};
	return context.db
		.collection("notifications")
		.insertOne(notif)
		.then(({ insertedId }) => {
			context.pubsub.publish("notification", notif);
			return insertedId;
		});
}

export function notifyFriendRequests(requests, context) {
	const date = now();
	const type = "FRIEND_REQUEST";
	const notifs = requests.map(r => ({
		user: new ObjectID(r.user.id),
		date,
		type,
		_from: new ObjectID(r._from._id)
	}));
	return context.db
		.collection("notifications")
		.insertMany(notifs)
		.then(({ insertedIds }) => {
			context.pubsub.publish(
				"notification",
				requests.map(r => ({ user: r.user, date, type, _from: r._from }))
			);
			return insertedIds;
		});
}
