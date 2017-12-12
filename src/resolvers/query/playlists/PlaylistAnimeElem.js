export function anime(
	{ anime }: { anime: String },
	args: any,
	context: Context
) {
	console.log(anime)
	return context.db
		.collection('animes')
		.find({ _id: anime })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
