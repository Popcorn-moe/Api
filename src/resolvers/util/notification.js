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
