import { ObjectID } from 'mongodb'

export function author(root: any, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(root.author) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
