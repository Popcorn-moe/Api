/* @flow */

import { ObjectID } from 'mongodb'

type ID = string
type Context = any

const mapAnime = ({
	id,
	names,
	authors,
	tags,
	status,
	medias,
	season,
	cover,
	background,
	release_date,
	edit_date,
	posted_date
}: Anime) => ({
	id,
	names,
	authors,
	tags,
	status,
	medias,
	season,
	cover,
	background,
	release_date,
	edit_date,
	posted_date
})

export function me(root: any, args: any, context: Context): ?User {
	if (context.user) {
		return context.user.then(
			({
				id,
				login,
				email,
				group,
				newsletter,
				account_registered,
				avatar,
				playlists
			}: User) => ({
				id,
				login,
				email,
				group,
				newsletter,
				account_registered,
				avatar,
				playlists
			})
		)
	} else return null
}

export function tags(
	root: any,
	args: any,
	context: Context
): Promise<Array<Tag>> {
	return context.db
		.collection('tags')
		.find()
		.map(data => {
			data.id = data._id
			return data
		})
		.map(({ id, name, desc, color }: Tag) => ({
			id,
			name,
			desc,
			color
		}))
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
		.map(data => {
			data.id = data._id
			return data
		})
		.map(
			({
				id,
				login,
				email,
				group,
				newsletter,
				account_registered,
				avatar,
				playlists
			}: User) => ({
				id,
				login,
				email,
				group,
				newsletter,
				account_registered,
				avatar,
				playlists
			})
		)
		.toArray()
}

export function authors(
	root: any,
	args: any,
	context: Context
): Promise<Array<Author>> {
	return context.db
		.collection('authors')
		.find()
		.map(data => {
			data.id = data._id
			return data
		})
		.map(({ id, name, picture, bio, organisation }: Author) => ({
			id,
			name,
			picture,
			bio,
			organisation
		}))
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
		.map(data => {
			data.id = data._id
			return data
		})
		.map(mapAnime)
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
		.map(data => {
			data.id = data._id
			return data
		})
		.map(mapAnime)
		.toArray()
		.then(([anime]) => anime)
}

export function news(
	root: any,
	args: any,
	context: Context
): Promise<Array<News>> {
	return context.db
		.collection('news')
		.find()
		.map(data => {
			data.id = data._id
			return data
		})
		.map(({ id, name, author, content, cover, posted_date }: News) => ({
			id,
			name,
			author,
			content,
			cover,
			posted_date
		}))
		.toArray()
}

export function _news(
	root: any,
	{ id }: { id: ID },
	context: Context
): ?News {
	return context.db
		.collection('news')
		.find({ _id: new ObjectID(id) })
		.limit(1)
		.map(data => {
			data.id = data._id
			return data
		})
		.map(({ id, name, author, content, posted_date }: News) => ({
			id,
			name,
			author,
			content,
			posted_date
		}))
		.toArray()
		.then(([news]) => news)
}

/*

export function author(context: Context, { id }: { id: ID }): ?Author
{
    return context.db.collection('authors')
        .find({ _id: id })
        .limit(1)
        .map(({ _id: id, name, picture, bio, organisation, animes }: Author) =>
                 ({ id, name, picture, bio, organisation, animes }))
        .next();
}

export function anime(context: Context, { id }: { id: ID }): ?Anime
{
    return context.db.collection('animes')
        .find({ _id: id })
        .limit(1)
        .map(({
                  id, names, authors, tags, status, medias,
                  season, release_date, edit_date, posted_date
              }: Anime) => ({
            id, names, authors, tags, status, medias,
            season, release_date, edit_date, posted_date
        }))
        .next();
}

export function tag(context: Context, { id }: { id: ID }): ?Tag
{
    return context.db.collection('tags')
        .find({ _id: id })
        .limit(1)
        .map(({ _id: id, name, desc }: Tag) => ({ id, name, desc }))
        .next();
}

export function media(context: Context, { id }: { id: ID }): ?Media
{
    return context.db.collection('medias')
        .find({ id })
        .limit(1)
        .map(({
                  _id: id, comments, type, rate, release_date,
                  edit_date, posted_date
              }: Media) => ({
            _id: id, comments, type, rate, release_date,
            edit_date, posted_date
        }))
        .next();
}*/
