import { now, needGroup, ADMIN } from '../util/index'
import { ObjectID } from 'mongodb'

export function addNews(
	root: any,
	{ news }: { news: NewsInput },
	context: Context
): Promise<ID> {
	if (news.cover) news.cover = context.storage.getUrl(news.cover)
	// $FlowIgnore
	news.posted_date = now()
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('news')
			.insertOne(news)
			.then(({ insertedId }) => insertedId)
	)
}

export function deleteNews(
	root: any,
	{ id }: { id: ID },
	context: Context
): Promise<ID> {
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('news')
			.deleteOne({ _id: new ObjectID(id) })
			.then(() => id)
	)
}

export function updateNews(
	root: any,
	{ id, news }: { id: ID, news: NewsUpdate },
	context: Context
): Promise<ID> {
	if (news.cover) news.cover = context.storage.getUrl(news.cover)
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('news')
			.updateOne({ _id: new ObjectID(id) }, { $set: news })
			.then(() => id)
	)
}
