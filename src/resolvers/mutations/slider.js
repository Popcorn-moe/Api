import { needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

export function addSlide(root, { slide }, context) {
	const id = new ObjectID();
	return needGroup(context, ADMIN).then(() =>
		Promise.resolve(slide.image)
			.then(image => image && context.storage.save(id, image))
			.then(image => {
				if (image) slide.image = image;
				slide._id = id;
				return Promise.all([
					context.db
						.collection("slider")
						.update({ index: { $gte: slide.index } }, { $inc: { index: 1 } }),
					context.db
						.collection("slider")
						.insertOne(slide)
						.then(({ insertedId }) => ({ id: insertedId, ...slide }))
				]).then(([, res]) => res);
			})
	);
}

export function editSlide(root, { id, slide }, context) {
	return needGroup(context, ADMIN).then(() =>
		Promise.resolve(slide.image)
			.then(image => image && context.storage.save(id, image))
			.then(image => {
				if (image) slide.image = image;
				return context.db
					.collection("slider")
					.findOneAndUpdate({ _id: new ObjectID(id) }, { $set: slide })
					.then(({ value: slide }) => ({ id, ...slide }));
			})
	);
}

export function delSlide(root, { id }, context) {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection("slider")
			.findOneAndDelete({ _id: new ObjectID(id) })
			.then(({ value: { index } }) => {
				context.db
					.collection("slider")
					.update({ index: { $gte: index } }, { $inc: { index: -1 } });
				return id;
			})
			.then(() => id)
	);
}
