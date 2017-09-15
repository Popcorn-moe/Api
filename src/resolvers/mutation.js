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
	context: Context,
	{ file }: { file: Upload },
	req: any
): Promise<Result> | Result {
	needAuth(req)
	if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
		context.storage.removeFile(file)
		return {
			error: `MimeType ${file.mimetype} is not and image Mime Type`
		}
	}
	return req.user
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
	if (anime.background) anime.cover = storage.getUrl(anime.background)
	anime.edit_date = time
}

export function addAnime(
	context: Context,
	{ anime }: { anime: AnimeInput },
	req: any
): Promise<ID> {
	const time = now()
	transformAnime(anime, time, context.storage)
	// $FlowIgnore
	anime.posted_date = time
	return needGroup(req, ADMIN).then(() =>
		context.db
			.collection('animes')
			.insertOne(anime)
			.then(({ insertedId }) => insertedId)
	)
}

export function updateAnime(
	context: Context,
	{ id, anime }: { id: ID, anime: AnimeInput },
	req: any
): Promise<ID> {
	transformAnime(anime, now(), context.storage)
	return needGroup(req, ADMIN).then(() =>
		context.db
			.collection('animes')
			.updateOne({ _id: new ObjectID(id) }, { $set: anime })
			.then(() => id)
	)
}

export function addTag(
	context: Context,
	{ tag }: { tag: TagInput },
	req: any
): Promise<ID> {
	return needGroup(req, ADMIN).then(() =>
		context.db
			.collection('tags')
			.insertOne(tag)
			.then(({ insertedId }) => insertedId)
	)
}

export function updateTag(
	context: Context,
	{ id, tag }: { id: ID, tag: TagUpdate },
	req: any
): Promise<ID> {
	return needGroup(req, ADMIN).then(() =>
		context.db
			.collection('tags')
			.updateOne({ _id: new ObjectID(id) }, { $set: tag })
			.then(() => id)
	)
}

export function deleteTag(
	context: Context,
	{ id }: { id: ID },
	req: any
): Promise<ID> {
	return needGroup(req, ADMIN).then(() =>
		context.db
			.collection('tags')
			.deleteOne({ _id: new ObjectID(id) })
			.then(() => id)
	)
}

/*export function me(context: Context, { user }: { user: ?User }): User
{
    //todo: check if user.id is the right id
    return context.db.collection('users')
        .findOneAndUpdate({ _id: user.id }, {
            $set: {
                login     : user.login,
                email     : user.email,
                group     : user.group,
                newsletter: user.newsletter,
                ratings   : user.ratings,
                last_edit : now()
            }
        }, { returnOriginal: false })
        .then(r => r.value);
}

export function comment(context: Context, { media, content }: { media: ?ID, content: ?string }): ID
{
    let user = null; //todo: get user
    return context.db.collection('comments')
        .insertOne(
            {
                user,
                content,
                posted: now()
            })
        .then(r => r.insertedId);
}

export function edit_comment(context: Context, { id, content }: { id: ?ID, content: ?string })
{
    let user = null; //todo: get user
    return context.db.collection('comments')
        .findOneAndUpdate({ _id: id }, {
            $set: {
                user,
                content,
                edited: now()
            }
        });
}

export function rate(context: Context, { media, rating }: { media: ?ID, rating: ?number })
{
    let user = null; //todo: get user
    return context.db.collection('ratings')
        .insertOne(
            {
                media,
                rating,
                time: now()
            });
}*/

function now() {
	return new Date().getTime()
}
