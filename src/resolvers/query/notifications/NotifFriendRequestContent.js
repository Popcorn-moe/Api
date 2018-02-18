import { ObjectID } from 'mongodb'

export function _from({ _from }, args, context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(_from) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}

export function user({ user }, args, context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(user) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
