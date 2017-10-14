export function __resolveType(obj) {
	if (obj.anime) return 'PlaylistAnimeElem'
	else if (obj.media) return 'PlaylistMediaElem'
}
