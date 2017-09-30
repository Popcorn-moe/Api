import { ObjectID } from 'mongodb'

export function authors(root: any, args: any, context: Context) {
	return context.db
		.collection('authors')
		.find({ _id: { $in: root.authors.map(id => new ObjectID(id)) } })
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

export function tags(root: any, args: any, context: Context) {
	return context.db
		.collection('tags')
		.find({ _id: { $in: root.tags.map(id => new ObjectID(id)) } })
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

export function medias(root: any, args: any, context: Context) {
	return context.db
		.collection('medias')
		.find({ _id: { $in: root.medias.map(id => new ObjectID(id)) } })
		.map(data => {
			data.id = data._id
			return data
		})
		.map(
			({
				id,
				comments,
				type,
				rate,
				release_date,
				edit_date,
				posted_date
			}: Media) => ({
				id,
				comments,
				type,
				rate,
				release_date,
				edit_date,
				posted_date
			})
		)
		.toArray()
}
