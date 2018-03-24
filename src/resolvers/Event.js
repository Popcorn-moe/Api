export function __resolveType(obj) {
	switch (obj.type) {
		case "MESSAGE":
			return "MessageEvent";
		case "ANIME_FOLLOW":
			return "AnimeFollowEvent";
		case "NEW_FRIEND":
			return "NewFriendEvent";
		case "PLAYLIST_ADD":
			return "PlaylistAddEvent";
		case "MEDIA_WATCH":
			return "MediaWatchEvent";
	}
}