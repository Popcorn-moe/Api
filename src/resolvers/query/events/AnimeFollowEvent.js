export { user } from './Event'

export function anime({ anime }, args, context) {
	return context.db
		.collection('animes')
		.find({ _id: anime })
		.limit(1)
		.map(({ _id, ...fields }) => ({ id: _id, ...fields }))
		.next()
}
