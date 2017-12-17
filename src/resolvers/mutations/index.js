import { addAnime, addSeason, updateAnime } from './animes'
import { addAuthor, deleteAuthor, updateAuthor } from './authors'
import { addMedia, linkMedia } from './medias'
import { addNews, updateNews, deleteNews } from './news'
import { delNotification } from './notifications'
import { addTag, deleteTag, updateTag } from './tags'
import {
	acceptFriendRequest,
	delFriend,
	sendFriendsRequests,
	setAvatar,
	updateUsers
} from './users'

export {
	//ANIME
	addAnime,
	addSeason,
	updateAnime,
	//AUTHOR
	addAuthor,
	deleteAuthor,
	updateAuthor,
	//MEDIA
	addMedia,
	linkMedia,
	//NEWS
	addNews,
	updateNews,
	deleteNews,
	//NOTIFICATIONS
	delNotification,
	//TAGS
	addTag,
	deleteTag,
	updateTag,
	//USER
	acceptFriendRequest,
	delFriend,
	sendFriendsRequests,
	setAvatar,
	updateUsers
}

export function hello(root: any, { name }: { name: String }, context: Context) {
	context.pubsub.publish('test', { name, licorne: 'magique' })
	return `hello ${name}!`
}
