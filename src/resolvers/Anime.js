import { ObjectID } from 'mongodb'
import { addSeason as mAddSeason } from './mutation'

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

export function seasons(root: any, args: any, context: Context) {
	return root.seasons.map(season => season && { anime: root.id, ...season })
}

export function season(
	root: any,
	{ season }: { season: Number },
	context: Context
) {
	return root.seasons[season] && { anime: root.id, ...root.seasons[season] }
}

export function addSeason(
	root: any,
	{ season }: { season: SeasonInput },
	context: Context
) {
	return mAddSeason(root, { season, anime: root.id }, context)
}
