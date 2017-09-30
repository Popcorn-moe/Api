import { GraphQLScalarType } from 'graphql'
import { GraphQLError } from 'graphql/error'
import { Kind } from 'graphql/language'

export default new GraphQLScalarType({
	name: 'Url',
	description: 'An Url',
	serialize(value) {
		return value.toString ? value.toString() : null
	},
	parseValue(value) {
		return value.toString ? value.toString() : null
	},
	parseLiteral(ast) {
		if (ast.kind === Kind.STRING)
			throw new GraphQLError(
				`Query error: Can only parse strings to urls but got a: ${ast.kind}`
			)
		return ast.value
	}
})
