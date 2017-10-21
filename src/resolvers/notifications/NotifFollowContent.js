import { ObjectID } from 'mongodb'

export function anime({ anime }: { anime: ID }, args: any, context: Context) {
	return context.db
		.collection('animes')
		.find({ _id: new ObjectID(anime) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
