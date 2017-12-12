import { needGroup, ADMIN } from '../util/index'
import { ObjectID } from 'mongodb'

export function addAuthor(
	root: any,
	{ author }: { author: AuthorInput },
	context: Context
): Promise<ID> {
	if (author.picture) author.picture = context.storage.getUrl(author.picture)
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('authors')
			.insertOne(author)
			.then(({ insertedId }) => insertedId)
	)
}

export function updateAuthor(
	root: any,
	{ id, author }: { id: ID, author: AuthorUpdate },
	context: Context
): Promise<ID> {
	if (author.picture) author.picture = context.storage.getUrl(author.picture)
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('authors')
			.updateOne({ _id: new ObjectID(id) }, { $set: author })
			.then(() => id)
	)
}

export function deleteAuthor(
	root: any,
	{ id }: { id: ID },
	context: Context
): Promise<ID> {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('authors')
			.deleteOne({ _id: new ObjectID(id) })
			.then(() => id)
	)
}
