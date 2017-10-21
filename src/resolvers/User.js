/* @flow */
import { ObjectID } from 'mongodb'

export function playlists(root: any, args: any, context: Context) {
	return context.db
		.collection('playlists')
		.find({ _id: { $in: root.playlists.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function friends(root: any, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: { $in: root.friends.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function blocked(root: any, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: { $in: root.blocked.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}
