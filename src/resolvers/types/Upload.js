import { GraphQLScalarType } from 'graphql'

export default new GraphQLScalarType({
	name: 'Upload',
	description: 'Upload type is sent with multipart/form-data',
	serialize(value) {
		throw new Error('Unserializable type: Upload', value)
	},
	parseValue: value => value,
	parseLiteral(ast) {
		throw new Error('Cannot parse from literal, type: Upload', ast)
	}
})
