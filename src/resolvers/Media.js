import { needGroup, ADMIN } from './util'
import { linkMedia } from './mutation'

export function linkTo(
	root: any,
	{ anime, season, episode }: { anime: ID, season: Number, episode: Number },
	context: Context
) {
	return linkMedia(root, { media: root.id, anime, season, episode }, context)
}
