import { ObjectID } from 'mongodb'
export { user } from './Event'

export function friend(
	{ friend }: { friend: ID },
	args: any,
	context: Context
) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(friend) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
