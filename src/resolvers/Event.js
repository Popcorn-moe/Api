export function __resolveType(obj) {
	switch (obj.type) {
		case "MESSAGE":
			return "MessageEvent";
		case "USER_FOLLOW":
			return "UserFollowEvent";
		case "ANIME_FOLLOW":
			return "AnimeFollowEvent";
		case "PLAYLIST_ADD":
			return "PlaylistAddEvent";
		case "MEDIA_WATCH":
			return "MediaWatchEvent";
	}
}
