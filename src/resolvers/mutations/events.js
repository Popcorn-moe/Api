import { now, needAuth } from '../util'
import { ObjectID } from 'mongodb'

//Do not import in mutations
export function newFriendEvent(
	{ user, friend }: { user: ID, friend: ID },
	context: Context
) {
	const event = {
		user: new ObjectID(user),
		date: now(),
		type: 'NEW_FRIEND',
		friend
	}
	return context.db
		.collection('events')
		.insertOne(event)
		.then(({ insertedId }) => {
			return insertedId //TODO: add subscription
		})
}

export function messageEvent(
	{ message }: { message: String },
	context: Context
) {
	needAuth(context)
	return context.user.then(({ _id }) => {
		const event = {
			user: new ObjectID(_id),
			date: now(),
			type: 'MESSAGE',
			message
		}
		return context.db
			.collection('events')
			.insertOne(event)
			.then(({insertedId}) => {
				return insertedId //TODO: add subscription
			})
	});
}
