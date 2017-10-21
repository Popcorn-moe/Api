export function __resolveType(obj) {
	switch (obj.type) {
		case 'MESSAGE':
			return 'NotifMessageContent'
		case 'FOLLOW':
			return 'NotifFollowContent'
		case 'FRIEND_REQUEST':
			return 'NotifFriendRequestContent'
	}
}
