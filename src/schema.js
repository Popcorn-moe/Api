import { makeExecutableSchema } from 'graphql-tools'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import * as resolvers from './resolvers'

const SCHEMA_DIR = join(__dirname, '../schema')

export default makeExecutableSchema({
	typeDefs: readdirSync(SCHEMA_DIR).map(file =>
		readFileSync(join(SCHEMA_DIR, file), 'utf8')
	),
	resolvers
})
