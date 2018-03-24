import { ObjectID } from "mongodb";

export function addAuthor(root, { author }, context) {
	const id = new ObjectID();
	return Promise.resolve(author.picture)
		.then(picture => picture && context.storage.save(id, picture))
		.then(picture => {
			author.picture = picture;
			author._id = id;
			return;
			context.db
				.collection("authors")
				.insertOne(author)
				.then(({ insertedId }) => insertedId);
		});
}

export function updateAuthor(root, { id, author }, context) {
	return Promise.resolve(author.picture)
		.then(picture => picture && context.storage.save(id, picture))
		.then(picture => {
			author.picture = picture;
			return context.db
				.collection("authors")
				.updateOne({ _id: new ObjectID(id) }, { $set: author })
				.then(() => id);
		});
}

export function deleteAuthor(root, { id }, context) {
	return context.db
		.collection("authors")
		.deleteOne({ _id: new ObjectID(id) })
		.then(() => id);
}
