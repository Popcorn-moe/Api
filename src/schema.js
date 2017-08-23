import { makeExecutableSchema } from 'graphql-tools';
import { readFileSync } from 'fs'
import { join } from 'path'
import * as resolvers from './resolvers'

export default makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, '../graphql.schema'), 'UTF-8').toString(),
    resolvers
})