import { ObjectID } from 'mongodb'

export function authors(root: any, args: any, context: Context) {
	return context.db
		.collection('authors')
		.find({ _id: { $in: root.authors.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function tags(root: any, args: any, context: Context) {
	return context.db
		.collection('tags')
		.find({ _id: { $in: root.tags.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function medias(root: any, args: any, context: Context) {
	return context.db
		.collection('medias')
		.find({ _id: { $in: root.medias.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}
