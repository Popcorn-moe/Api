import { needGroup, ADMIN } from '../util/index'
import { ObjectID } from 'mongodb'

export function addTag(root, { tag }, context) {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('tags')
			.insertOne(tag)
			.then(({ insertedId }) => insertedId)
	)
}

export function updateTag(root, { id, tag }, context) {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('tags')
			.updateOne({ _id: new ObjectID(id) }, { $set: tag })
			.then(() => id)
	)
}

export function deleteTag(root, { id }, context) {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('tags')
			.deleteOne({ _id: new ObjectID(id) })
			.then(() => id)
	)
}
