import { ObjectID } from 'mongodb'

export function media({ media }, args, context) {
	return context.db
		.collection('medias')
		.find({ _id: new ObjectID(media) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
