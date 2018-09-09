import md5 from "md5";

export function picture({ picture, id }, args, context) {
	return picture || `https://www.gravatar.com/avatar/${md5(id)}?d=robohash`;
}

export function animes({ id }, { limit, sort }, context) {
	return context.db
		.collection("animes")
		.find({ authors: id.toString() }) //TODO: Not legal
		.limit(limit)
		.sort(
			sort === "NONE"
				? {}
				: {
						name: sort === "ASC" ? 1 : -1
				  }
		)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}
