import { needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

export async function addSlide(root, { slide }, context) {
	await needGroup(context, ADMIN);

	const id = new ObjectID();

	if (slide.image) slide.image = await context.storage.save(id, slide.image);

	slide._id = id;

	await context.db
		.collection("slider")
		.update({ index: { $gte: slide.index } }, { $inc: { index: 1 } });

	return context.db
		.collection("slider")
		.insertOne(slide)
		.then(({ insertedId }) => ({ id: insertedId, ...slide }));
}

export async function editSlide(root, { id, slide }, context) {
	await needGroup(context, ADMIN);

	if (slide.image) slide.image = await context.storage.save(id, slide.image);

	return context.db
		.collection("slider")
		.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: slide })
		.then(({ value }) => ({ id, ...value, ...slide }));
}

export async function delSlide(root, { id }, context) {
	await needGroup(context, ADMIN);

	const { value: { index } } = await context.db
		.collection("slider")
		.findOneAndDelete({ _id: new ObjectID(id) });

	await context.db
		.collection("slider")
		.update({ index: { $gte: index } }, { $inc: { index: -1 } });

	return id;
}
