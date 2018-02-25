import { ObjectID } from "mongodb";

export function episodes({ episodes }, args, context) {
	if (episodes)
		return context.db
			.collection("medias")
			.find({ _id: { $in: episodes.map(id => new ObjectID(id)) } })
			.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
			.toArray();
	else return [];
}
