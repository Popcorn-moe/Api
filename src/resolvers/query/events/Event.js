import { ObjectID } from 'mongodb'

export function __resolveType(obj) {
	switch (obj.type) {
		case 'MESSAGE':
			return 'MessageEvent'
		case 'ANIME_FOLLOW':
			return 'AnimeFollowEvent'
		case 'NEW_FRIEND':
			return 'NewFriendEvent'
		case 'PLAYLIST_ADD':
			return 'PlaylistAddEvent'
		case 'MEDIA_WATCH':
			return 'MediaWatchEvent'
	}
}

export function user({ user }, args, context) {
	return context.db
		.collection('users')
		.find({ _id: new ObjectID(user) })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
