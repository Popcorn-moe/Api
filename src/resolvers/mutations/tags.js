import { needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

export async function addTag(root, { tag }, context) {
	await needGroup(context, ADMIN);

	return context.db
		.collection("tags")
		.insertOne(tag)
		.then(({ insertedId }) => insertedId);
}

export async function updateTag(root, { id, tag }, context) {
	await needGroup(context, ADMIN);

	await context.db
		.collection("tags")
		.updateOne({ _id: new ObjectID(id) }, { $set: tag });

	return id;
}

export async function deleteTag(root, { id }, context) {
	await needGroup(context, ADMIN);

	await context.db.collection("tags").deleteOne({ _id: new ObjectID(id) });

	return id;
}
