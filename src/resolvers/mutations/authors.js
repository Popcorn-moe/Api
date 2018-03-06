import { ADMIN, needGroup } from "../util/index";
import { ObjectID } from "mongodb";

export async function addAuthor(root, { author }, context) {
	await needGroup(context, ADMIN);

	const id = new ObjectID();

	if (author.picture) author.picture = await context.storage.save(id, picture);

	author._id = id;

	return context.db
		.collection("authors")
		.insertOne(author)
		.then(({ insertedId }) => insertedId);
}

export async function updateAuthor(root, { id, author }, context) {
	await needGroup(context, ADMIN);

	if (author.picture)
		author.picture = await context.storage.save(id, author.picture);

	await context.db
		.collection("authors")
		.updateOne({ _id: new ObjectID(id) }, { $set: author });

	return id;
}

export async function deleteAuthor(root, { id }, context) {
	await needGroup(context, ADMIN);

	await context.db.collection("authors").deleteOne({ _id: new ObjectID(id) });

	return id;
}
