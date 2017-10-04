/* @flow */
import { ObjectID } from 'mongodb'

export function relations(root: any, args: any, context: Context) {
	return context.db
		.collection('relations')
		.find({ _id: { $in: root.relations.map(id => new ObjectID(id)) } })
		.map(data => {
			data.id = data._id
			return data
		})
		.map(({ status, to, date }: Relation) => ({
			status,
			to,
			date
		}))
		.toArray()
}
