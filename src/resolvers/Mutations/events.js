import { now } from "../util";
import { ObjectID } from "mongodb";

export function messageEvent({ message }, context) {
	return context.user.then(({ _id }) => {
		const event = {
			user: new ObjectID(_id),
			date: now(),
			type: "MESSAGE",
			message
		};
		return context.db
			.collection("events")
			.insertOne(event)
			.then(({ insertedId }) => {
				return insertedId; //TODO: add subscription
			});
	});
}

export function userFollowEvent(user, context) {
	return context.user.then(({ _id }) => {
		const event = {
			user: new ObjectID(_id),
			type: "USER_FOLLOW",
			follow: new ObjectID(user)
		};
		return context.db
			.collection("events")
			.findOneAndUpdate(event, { ...event, date: now() }, { upsert: true })
			.then(({ insertedId }) => {
				return insertedId; //TODO: add subscription
			});
	});
}
