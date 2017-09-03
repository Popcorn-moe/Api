import { generateTypes } from 'gql2flow/util/interface'
import { generateModule, writeModuleToFile } from 'gql2flow/util/module'
import schema from '../src/schema.js'
import { graphql, introspectionQuery } from 'graphql'

graphql(schema, introspectionQuery).then(schema => {
    const interfaces = generateTypes(schema, {
        ignoredTypes: '',
        whitelist: [],
        typeMap: {}
    })
    const module = generateModule(null, interfaces)

    writeModuleToFile('./flowtypes/schema.js', module)
}).catch(console.error)