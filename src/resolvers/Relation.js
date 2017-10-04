import { ObjectID } from 'mongodb'

export function to(root: any, args: any, context: Context) {
	return get(context, root.to)
}

export function by(root: any, args: any, context: Context) {
	return get(context, root.by)
}

function get(context: Context, user) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(user) })
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
