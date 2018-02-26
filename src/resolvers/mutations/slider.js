import { needGroup, ADMIN } from "../util/index";
import { ObjectID } from "mongodb";

export function addSlide(root, { slide }, context) {
	return needGroup(context, ADMIN).then(() =>
		Promise.resolve(slide.image)
			.then(image => image && context.storage.save(image))
			.then(image => {
				if (image) slide.image = image;
				return context.db
					.collection("slider")
					.insertOne(slide)
					.then(({ insertedId }) => insertedId);
			})
	);
}
