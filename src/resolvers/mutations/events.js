import { now, needAuth } from "../util";
import { ObjectID } from "mongodb";

//Do not import in mutations
export function newFriendEvent({ user, friend }, context) {
	const event = {
		user: new ObjectID(user),
		date: now(),
		type: "NEW_FRIEND",
		friend
	};

	// TODO: Add subscription
	return context.db
		.collection("events")
		.insertOne(event)
		.then(({ insertedId }) => insertedId);
}

export async function messageEvent({ message }, context) {
	needAuth(context);

	const { _id } = await context.user;

	const event = {
		user: new ObjectID(_id),
		date: now(),
		type: "MESSAGE",
		message
	};

	// TODO: Add subscription
	return context.db
		.collection("events")
		.insertOne(event)
		.then(({ insertedId }) => insertedId);
}
