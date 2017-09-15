import { makeExecutableSchema } from 'graphql-tools'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as resolvers from './resolvers'

export default makeExecutableSchema({
	typeDefs: readFileSync(
		join(__dirname, '../schema.graphql'),
		'UTF-8'
	).toString(),
	resolvers
})
