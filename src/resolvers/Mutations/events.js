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
