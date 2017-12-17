export function user({ anime }: { anime: ID }, args: any, context: Context) {
	return context.db
		.collection('animes')
		.find({ _id: anime })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
