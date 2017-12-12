import { now, needGroup, ADMIN } from '../util/index'

export function addMedia(
	root: any,
	{ media }: { media: MediaInput },
	context: Context
): Promise<ID> {
	// $FlowIgnore
	media.comments = []
	// $FlowIgnore
	media.rate = 0
	// $FlowIgnore
	media.edit_date = now()
	// $FlowIgnore
	media.posted_date = now()
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('medias')
			.insertOne(media)
			.then(({ ops: [{ _id, ...result }] }) => ({ id: _id, ...result }))
	)
}

export function linkMedia(
	root: any,
	{
		media,
		anime,
		season,
		episode
	}: { media: ID, anime: ID, season: ?Number, episode: ?Number },
	context: Context
) {
	let update
	if (season && episode) {
		update = {
			$push: {
				[`seasons.${season.toString()}.episodes.${episode.toString()}`]: media
			}
		}
	} else {
		update = { $push: { medias: media } }
	}
	return needGroup(context, ADMIN).then(() =>
		context.db
			.collection('animes')
			.updateOne({ _id: anime }, update)
			.then(({ matchedCount }) => matchedCount == 1)
	)
}
