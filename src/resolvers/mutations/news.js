import { now, needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

export async function addNews(root, { news }, context) {
	await needGroup(context, ADMIN);

	const id = new ObjectID();
	const cover = news.cover && (await context.storage.save(id, news.cover));

	if (cover) news.cover = cover;
	news.posted_date = now();
	news._id = id;

	return context.db
		.collection("news")
		.insertOne(news)
		.then(({ insertedId }) => insertedId);
}

export async function deleteNews(root, { id }, context) {
	await needGroup(context, ADMIN);

	await context.db.collection("news").deleteOne({ _id: new ObjectID(id) });

	return id;
}

export async function updateNews(root, { id, news }, context) {
	await needGroup(context, ADMIN);

	const cover = news.cover && (await context.storage.save(id, news.cover));
	if (cover) news.cover = cover;

	await context.db
		.collection("news")
		.updateOne({ _id: new ObjectID(id) }, { $set: news });

	return id;
}
