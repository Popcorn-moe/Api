import { ObjectID } from 'mongodb'

export function to(root: any, args: any, context: Context) {
	return get(context, root.to)
}

export function by(root: any, args: any, context: Context) {
	return get(context, root.by)
}

function get(context: Context, user) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(user) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
