import { now } from "../util";
import { ObjectID } from "mongodb";

export function addNews(root, { news }, context) {
	const id = new ObjectID();
	return Promise.resolve(news.cover)
		.then(cover => cover && context.storage.save(id, cover))
		.then(cover => {
			if (cover) news.cover = cover;
			news.posted_date = now();
			news._id = id;
			return context.db
				.collection("news")
				.insertOne(news)
				.then(({ insertedId }) => insertedId);
		});
}

export function deleteNews(root, { id }, context) {
	return context.db
		.collection("news")
		.deleteOne({ _id: new ObjectID(id) })
		.then(() => id);
}

export function updateNews(root, { id, news }, context) {
	return Promise.resolve(news.cover)
		.then(cover => cover && context.storage.save(id, cover))
		.then(cover => {
			if (cover) news.cover = cover;
			return context.db
				.collection("news")
				.updateOne({ _id: new ObjectID(id) }, { $set: news })
				.then(() => id);
		});
}
