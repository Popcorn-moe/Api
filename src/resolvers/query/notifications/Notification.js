import { ObjectID } from 'mongodb'

export function __resolveType(obj) {
	switch (obj.type) {
		case 'MESSAGE':
			return 'NotifMessageContent'
		case 'ANIME_FOLLOW':
			return 'NotifAnimeFollowContent'
		case 'FRIEND_REQUEST':
			return 'NotifFriendRequestContent'
	}
}

export function user({ user }: { user: ID}, args: any, context: Context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(user) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
