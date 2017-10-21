import { ObjectID } from 'mongodb'

export function user({ user }: { user: ID }, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(user) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
