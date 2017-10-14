/* @flow */
import { ObjectID } from 'mongodb'

export function relations(root: any, args: any, context: Context) {
	return context.db
		.collection('relations')
		.find({ _id: { $in: root.relations.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function playlists(root: any, args: any, context: Context) {
	return context.db
		.collection('playlists')
		.find({ _id: { $in: root.playlists.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}
