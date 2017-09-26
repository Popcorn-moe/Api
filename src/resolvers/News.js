import { ObjectID } from 'mongodb'

export function author(root: any, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(root.author) })
		.limit(1)
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
		.then(([user]) => user)
}
