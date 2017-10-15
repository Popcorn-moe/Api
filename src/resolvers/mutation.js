/* @flow */

import { needAuth, needGroup, ADMIN } from './util'
import { ObjectID } from 'mongodb'

type ID = string
type Context = any
type Upload = any

// https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types#Images_types

const IMAGE_MIME_TYPES = [
	'image/gif', // GIF images (lossless compression, superseded by PNG)
	'image/jpeg', // JPEG images
	'image/png', // PNG images
	'image/svg+xml' // SVG images (vector images)
]

export function setAvatar(
	root: any,
	{ file }: { file: Upload },
	context: Context
): Promise<Result> | Result {
	needAuth(context)
	if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
		context.storage.removeFile(file)
		return {
			error: `MimeType ${file.mimetype} is not and image Mime Type`
		}
	}
	return context.user
		.then(user => {
			user.avatar = context.storage.getUrl(file)
			return user.save()
		})
		.then(() => ({
			error: null
		}))
}

function transformAnime(anime: any, time, storage) {
	if (anime.cover) anime.cover = storage.getUrl(anime.cover)
	if (anime.background) anime.background = storage.getUrl(anime.background)
	anime.edit_date = time
}

export function addAnime(
	root: any,
	{ anime }: { anime: AnimeInput },
	context: Context
): Promise<ID> {
	const time = now()
	transformAnime(anime, time, context.storage)
	// $FlowIgnore
	anime.posted_date = time
	// $FlowIgnore
	anime._id = toId(anime.names[0])
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('animes')
			.insertOne(anime)
			.then(({ insertedId }) => insertedId)
	)
}

export function updateAnime(
	root: any,
	{ id, anime }: { id: ID, anime: AnimeInput },
	context: Context
): Promise<ID> {
	transformAnime(anime, now(), context.storage)
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('animes')
			.updateOne({ _id: id }, { $set: anime })
			.then(() => id)
	)
}

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

export function addNews(
	root: any,
	{ news }: { news: NewsInput },
	context: Context
): Promise<ID> {
	if (news.cover) news.cover = context.storage.getUrl(news.cover)
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

export function addMedia(
	root: any,
	{ media }: { media: MediaInput },
	context: Context
): Promise<ID> {
	media.comments = []
	media.rate = 0
	media.edit_date = now()
	media.posted_date = now()
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('medias')
			.insertOne(media)
			.then(({ ops: [result] }) => {
				result.id = result._id
				return result
			})
	)
}

export function linkMedia(
	root: any,
	{
		media,
		anime,
		season,
		episode
	}: { media: ID, anime: ID, season: Number, episode: Number },
	context: Context
) {
	let update
	if (season == -1 || episode == -1) {
		update = { $push: { medias: media } }
	} else {
		update = { $push: { [`seasons.${season}.episodes.${episode}`]: media } }
	}
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('animes')
			.updateOne({ _id: anime }, update)
			.then(({ matchedCount }) => matchedCount == 1)
	)
}

export function updateUsers(
	root: any,
	{ users }: { users: ?Array<?UserInput> },
	context: ?Context
): ?Promise<?Array<?ID>>
{
	return needGroup(context, ADMIN).then(
		() => Promise.all(
			users.map(
				user => context.db.collection('users').updateOne({ _id: new ObjectID(user.id) }, { $set: user })
			)
		)
	).then(() => users.map(({ id }) => id))
}

function now() {
	return new Date()
}

function toId(name) {
	return name
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/ /g, '-')
		.toLowerCase()
}
