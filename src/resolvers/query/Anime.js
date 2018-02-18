import { ObjectID } from 'mongodb'
import { addSeason as mAddSeason } from '../mutations/animes'

export function authors(root, args, context) {
	return context.db
		.collection('authors')
		.find({ _id: { $in: root.authors.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function tags(root, args, context) {
	return context.db
		.collection('tags')
		.find({ _id: { $in: root.tags.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function medias(root, args, context) {
	return context.db
		.collection('medias')
		.find({ _id: { $in: root.medias.map(id => new ObjectID(id)) } })
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.toArray()
}

export function seasons(root, args, context) {
	return root.seasons.map(season => season && { anime: root.id, ...season })
}

export function season(root, { season }, context) {
	return root.seasons[season] && { anime: root.id, ...root.seasons[season] }
}

export function addSeason(root, { season }, context) {
	return mAddSeason(root, { season, anime: root.id }, context)
}
