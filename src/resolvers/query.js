/* @flow */

import { ObjectID } from 'mongodb'

type ID = string
type Context = any

export function me(root: any, args: any, context: Context) {
	return context.user.then(user => {
		if(!user.friends) user.friends = [];
		if(!user.blocked) user.blocked = [];
		return user
	})
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
	{ name }: { name: String },
	context: Context
): Promise<Array<User>> {
	return name
		? context.db
				.collection('users')
				.find({ login: new RegExp('.*' + name + '.*', 'i') })
				.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
				.toArray()
		: []
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
