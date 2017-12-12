import * as Query from './query/query'
import * as Mutation from './mutations'
import * as Subscription from './subscription'
import * as User from './query/User'
import * as Anime from './query/Anime'
import * as News from './query/News'
import * as Media from './query/Media'
import * as Season from './query/Season'
import { PlaylistElem, PlaylistAnimeElem, PlaylistMediaElem } from './query/playlists'
import {
	Notification,
	NotifAnimeFollowContent,
	NotifFriendRequestContent
} from './query/notifications'
import { Upload, Url, Date, Time, DateTime } from './types'

export {
	Query,
	Mutation,
	Subscription,
	User,
	Anime,
	News,
	Media,
	PlaylistElem,
	PlaylistAnimeElem,
	PlaylistMediaElem,
	Notification,
	NotifAnimeFollowContent,
	NotifFriendRequestContent,
	//types
	Upload,
	Url,
	Date,
	Time,
	DateTime
}
