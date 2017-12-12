import { needGroup, ADMIN } from '../util/index'
import { ObjectID } from 'mongodb'

export function addTag(
	root: any,
	{ tag }: { tag: TagInput },
	context: Context
): Promise<ID> {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('tags')
			.insertOne(tag)
			.then(({ insertedId }) => insertedId)
	)
}

export function updateTag(
	root: any,
	{ id, tag }: { id: ID, tag: TagUpdate },
	context: Context
): Promise<ID> {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('tags')
			.updateOne({ _id: new ObjectID(id) }, { $set: tag })
			.then(() => id)
	)
}

export function deleteTag(
	root: any,
	{ id }: { id: ID },
	context: Context
): Promise<ID> {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('tags')
			.deleteOne({ _id: new ObjectID(id) })
			.then(() => id)
	)
}
