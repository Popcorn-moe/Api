import schema from './src/schema'
import { join } from 'path'
import { inspect } from 'util'
import { graphql, introspectionQuery } from 'graphql'

graphql(schema, '{ me { email login id }}', { message: 'hello' }).then(res => console.log(JSON.stringify(res, null, 2)))