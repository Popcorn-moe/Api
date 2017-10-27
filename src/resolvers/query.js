import { needAuth } from './util'
import { ObjectID } from 'mongodb'

type ID = string
type Context = any

export function me(root: any, args: any, context: Context) {
	return context.user
		? context.user.then(user => {
				if (!user.friends) user.friends = []
				if (!user.blocked) user.blocked = []
				return user
			})
		: null
}

export function tags(
	root: any,
	args: any,
	context: Context
): Promise<Array<Tag>> {
	return context.db
		.collection('tags')
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function users(
	root: any,
	args: any,
	context: Context
): Promise<Array<User>> {
	return context.db
		.collection('users')
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function searchUser(
	root: any,
	{ name, limit }: { name: String, limit: Number },
	context: Context
): Promise<Array<User>> {
	return name
		? context.db
				.collection('users')
				.find({ login: new RegExp(escapeRegExp(name), 'i') })
				.limit(limit)
				.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
				.toArray()
		: Promise.resolve([])
}

export function searchAnime(
	root: any,
	{ name, limit }: { name: String, limit: Number },
	context: Context
): Promise<Array<User>> {
	return name
		? context.db
				.collection('animes')
				.find({ names: new RegExp(escapeRegExp(name), 'i') })
				.limit(limit)
				.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
				.toArray()
		: Promise.resolve([])
}

export function authors(
	root: any,
	args: any,
	context: Context
): Promise<Array<Author>> {
	return context.db
		.collection('authors')
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function animes(
	root: any,
	{ limit, sort }: { limit: number, sort: Sort },
	context: Context
): ?Array<Anime> {
	return context.db
		.collection('animes')
		.find()
		.limit(limit)
		.sort(
			sort === 'NONE'
				? {}
				: {
						name: sort === 'ASC' ? 1 : -1
					}
		)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function anime(
	root: any,
	{ id }: { id: ID },
	context: Context
): ?Array<Anime> {
	return context.db
		.collection('animes')
		.find({ _id: id })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
		.then(e => {
			console.log(e)
			return e
		})
}

export function news(
	root: any,
	args: any,
	context: Context
): Promise<Array<News>> {
	return context.db
		.collection('news')
		.find()
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function _news(root: any, { id }: { id: ID }, context: Context): ?News {
	return context.db
		.collection('news')
		.find({ _id: new ObjectID(id) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}

export function getNotifications(
	root: any,
	{ user }: { user: ID },
	context: Context
) {
	return context.db
		.collection('notifications')
		.find({ user: new ObjectID(user) })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function friendRequests(
	root: any,
	args: any,
	context: Context
): ?Array<User> {
	needAuth(context)
	return context.user.then(user =>
		context.db
			.collection('notifications')
			.find({ user: user._id, type: 'FRIEND_REQUEST' })
			.toArray()
			.then(notifs => {
				return context.db
					.collection('users')
					.find({ _id: { $in: notifs.map(notif => notif._from) } })
					.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
					.toArray()
			})
	)
}

export function pendingFriendRequests(
	root: any,
	args: any,
	context: Context
): ?Promise<Array<User>> {
	needAuth(context)
	return context.user.then(user =>
		context.db
			.collection('notifications')
			.find({ _from: user._id, type: 'FRIEND_REQUEST' })
			.toArray()
			.then(notifs => {
				return context.db
					.collection('users')
					.find({ _id: { $in: notifs.map(notif => notif.user) } })
					.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
					.toArray()
			})
	)
}


export function searchAnimes(
	root: any,
	{ limit, skip, name, order_by, status, type, authors, year, tags }: { limit: Number, skip: Number, name: String, order_by: String, status: AnimeStatus, type: MediaType, authors: Array<ID>, year: Number, tags: Array<ID>},
	context: Context
): ?Array<Anime> {
	return context.db.collection("animes")
		.find({
			names: new RegExp(escapeRegExp(name), 'i'),
			...(status ? { status }: {}),
			...(authors ? { authors: { $in: authors.map(a => new ObjectID(a))}}: {}),
			...(tags ? { tags: { $in: tags.map(t => new ObjectID(t))}}: {})
		})
		.skip(skip)
		.limit(limit)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray();
}

export function searchAuthor(
	root: any,
	{ name }: { name: String },
	context: Context
): Promise<Array<Author>> {
	return name
		? context.db
			.collection('authors')
			.find({ name: new RegExp(escapeRegExp(name), 'i') })
			.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
			.toArray()
		: Promise.resolve([])
}

function escapeRegExp(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
